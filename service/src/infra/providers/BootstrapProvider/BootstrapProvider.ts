import { IBootstrapProvider } from "./IBootstrapProvider";
import { injectable, inject } from "inversify";
import {
  Shoe,
  UserProfile,
  Repository,
  Catalogue,
  CatalogType,
  Inventory,
  Order,
} from "../../database";
import { AccessLevel } from "../../database/UserAccount";
import { Types } from "../../../configuration/inversify";
import mongoose, { Document } from "mongoose";
import {
  AdminFbProfile,
  SellerFbProfile,
  UserFbProfile,
} from "../../../assets/seeds/dev";
import { LogProvider } from "../LogProvider";
import path from "path";
import fs from "fs";
import _ from "lodash";
import { PaymentMethod, TrackingStatus } from "../../../assets/constants";
import * as csv from "fast-csv";
import {
  THCFbProfile,
} from "../../../assets/seeds/prod";
import { IFirebaseAuthService } from "../../services/FirebaseAuthService";

@injectable()
export class BootstrapProvider implements IBootstrapProvider {
  constructor(
    @inject(Types.ShoeRepository) private shoeRepository: Repository<Shoe>,
    @inject(Types.ProfileRepository) private profileRepository: Repository<UserProfile>,
    @inject(Types.CatalogueRepository) private catalogRepository: Repository<Catalogue>,
    @inject(Types.InventoryRepository) private inventoryRepo: Repository<Inventory>,
    @inject(Types.OrderRepository) private orderRepo: Repository<Order>,
    @inject(Types.FirebaseAuthService) private firebaseAuthService: IFirebaseAuthService
  ) { }

  private readonly thcSeeds: string = path.join(
    process.cwd(),
    "resources",
    "seeds",
    "THC_08012021.csv"
  );

  public async bootstrapDevUserData(): Promise<any> {
    return Promise.all([
      AdminFbProfile, UserFbProfile, SellerFbProfile
    ].map(p => this._createUserDataWithFirebase(p)));
  }

  public async bootstrapProdUserData(): Promise<any> {
    return Promise.all([
      THCFbProfile
    ].map(p => this._createUserDataWithFirebase(p)));
  }

  private async _createUserDataWithFirebase(profile: Partial<UserProfile> & { password: string }) {
    const count = await this.profileRepository.countDocuments({
      userProvidedEmail: profile.userProvidedEmail
    }).exec();

    if (count === 0) {
      const firebaseUser = await this.firebaseAuthService.createVerifiedUserWithEmailAndPassword(
        profile.userProvidedEmail,
        profile.password
      );
      const newProfile = await this.profileRepository.create({
        firebaseAccountId: firebaseUser.uid,
        userProvidedEmail: firebaseUser.email,
        isSeller: profile.accessLevel === AccessLevel.Seller,
        accessLevel: profile.accessLevel,
        userProvidedName: profile.userProvidedName,
        userProvidedAddress: profile.userProvidedAddress,
      });

      LogProvider.instance.info(`Create user data success for ${newProfile.userProvidedEmail}`);
    }
  }

  public async bootstrapShoesData(): Promise<any> {
    const count = await this.shoeRepository.countDocuments().exec();

    if (count > 0) {
      return;
    }

    const shoeCount = await this.shoeRepository.estimatedDocumentCount().exec();
    const shoes = this.getRawShoesData();
    if (shoeCount < shoes.length) {
      LogProvider.instance.info(`Inserting ${shoes.length} shoes`);
      try {
        const insertResults = await this.shoeRepository.insertMany(shoes, {
          ordered: false,
          rawResult: false,
        });
        LogProvider.instance.info(`Inserted: ${insertResults.length} shoes`);
      } catch (error) {
        LogProvider.instance.error(`Error bootstrapping shoes data`, error);
      }
    }

    return null;
  }

  public getRawShoesData(): Partial<Shoe>[] {
    const seedPath = path.join(process.cwd(), "resources", "seeds", "shoes.json");
    const rawShoes: any[] = JSON.parse(fs.readFileSync(seedPath).toString());

    return rawShoes.map((shoe) => ({
      _id: mongoose.Types.ObjectId(shoe._id["$oid"]),
      brand: shoe.brand,
      category: shoe.category,
      colorway: shoe.colorway,
      description: shoe.description,
      gender: shoe.gender,
      releaseDate: shoe.releaseDate ? new Date(shoe.releaseDate["$date"]) : null,
      name: shoe.name,
      styleId: shoe.styleId,
      media: shoe.media,
      urlKey: shoe.urlKey,
      title: shoe.title,
    }));
  }

  private _generateCatalog(
    document: Document[],
    title: string,
    description: string,
    tags: string[],
    coverImage?: string
  ): Partial<Catalogue> {
    return {
      title,
      description,
      productIds: document.map((t) => mongoose.Types.ObjectId(t.id)),
      tags,
      showOnHomepagePriority: 0,
      catalogType: CatalogType.REGULAR,
      ...(coverImage ? { coverImage } : {}),
    };
  }

  public async bootstrapCatalogData(): Promise<any> {
    const count = await this.catalogRepository.countDocuments({}).exec();

    if (count > 0) {
      return;
    }

    // this is assuming that shoe data is bootstrapped
    const [hot, nike, jordan, adidas, ranking] = await Promise.all([
      this.shoeRepository
        .find({ brand: "Jordan", "media.imageUrl": { $ne: "" } })
        .sort({ releaseDate: -1 })
        .limit(5)
        .exec(),
      this.shoeRepository
        .find({ brand: "Nike", "media.imageUrl": { $ne: "" } })
        .sort({ releaseDate: -1 })
        .limit(50)
        .exec(),
      this.shoeRepository
        .find({ brand: "Jordan", "media.imageUrl": { $ne: "" } })
        .sort({ releaseDate: -1 })
        .limit(30)
        .exec(),
      this.shoeRepository
        .find({ brand: "adidas", "media.imageUrl": { $ne: "" } })
        .sort({ releaseDate: -1 })
        .limit(30)
        .exec(),
      this.shoeRepository
        .find({ "media.imageUrl": { $ne: "" } })
        .sort({ createdAt: -1 })
        .limit(15)
        .exec(),
    ]);

    await this.catalogRepository.insertMany([
      this._generateCatalog(hot, "Đang hot", "", ["hot"]),
      this._generateCatalog(nike, "Nike nổi bật", "", ["nike"]),
      this._generateCatalog(jordan, "Jordan nổi bật", "", ["jordan"]),
      this._generateCatalog(adidas, "Adidas nổi bật", "", ["adidas"]),
      this._generateCatalog(ranking, "Bảng xếp hạng giày", "", ["ranking"]),
      this._generateCatalog(
        [],
        "Tuyển chọn bởi SneakGeek",
        "",
        ["toppick"],
        "https://sneakgeek.blob.core.windows.net/catalog-images/thumbnail1.jpeg"
      ),
      this._generateCatalog(
        [],
        "Mua ngay tại SneakGeek",
        "",
        ["buynow"],
        "https://sneakgeek.blob.core.windows.net/catalog-images/thumbnail2.jpg"
      ),
    ]);
  }

  public async bootstrapDevInventoryAndOrder(): Promise<void> {
    // Already bootstrapped
    const inventoryCount = await this.inventoryRepo.countDocuments({}).exec();
    if (inventoryCount > 0) {
      return;
    }

    const inventories = await this._bootstrapInventory();
    return this._bootstrapOrders(inventories);
  }

  private async _bootstrapInventory(): Promise<Inventory[]> {
    const seller = await this.profileRepository
      .findOne({ userProvidedEmail: "sneakgeek.test+seller@gmail.com" })
      .exec();
    const brands = ["Jordan", "Nike", "adidas"];
    const shoeIds = (
      await Promise.all(brands.map((b) => this._getShoeIdsByBrand(b)))
    ).reduce((prev, cur) => [...prev, ...cur]);
    const sellerId = seller._id as mongoose.Types.ObjectId;
    const rawInventories: Array<Partial<Inventory>> = shoeIds.map((s) => ({
      sellerId,
      shoeId: s,
      shoeSize: "8.5",
      sellPrice: 5000000,
      quantity: 10,
    }));

    return this.inventoryRepo.insertMany(rawInventories);
  }

  private async _getShoeIdsByBrand(brand: string) {
    return (
      await this.shoeRepository.find({ brand }).sort({ createdAt: -1 }).limit(100).exec()
    ).map((s) => s._id);
  }

  private async _bootstrapOrders(inventories: Array<Inventory>): Promise<any> {
    const buyer = await this.profileRepository
      .findOne({ userProvidedEmail: "sneakgeek.test+user@gmail.com" })
      .exec();
    const orders = inventories.slice(0, 10).map((inv) => ({
      buyerId: buyer._id as mongoose.Types.ObjectId,
      sellerId: inv.sellerId,
      shoeId: inv.shoeId,
      inventoryId: inv._id,
      shippingAddress: UserFbProfile.userProvidedAddress,
      soldPrice: inv.sellPrice,
      trackingStatus: [
        {
          status: TrackingStatus.WAITING_FOR_BANK_TRANSFER,
          date: new Date(),
        },
      ],
      paymentMethod: PaymentMethod.BANK_TRANSFER,
    }));

    return this.orderRepo.insertMany(orders, { ordered: false, rawResult: false });
  }

  public async bootstrapProdInventory(): Promise<void> {
    const count = await this.inventoryRepo.countDocuments().exec();
    if (count > 0) {
      return;
    }
    const rawInventories = await this._getTHCProdInventory();
    const notFoundSku = [];
    const mappedInventories = rawInventories.map(async (i) => {
      let sku: string = (i as any).sku;
      if (sku.indexOf(" ") >= 0) {
        sku = sku.split(" ").join("-").toUpperCase();
      }
      const shoe = await this.shoeRepository.findOne({ styleId: sku }).exec();

      if (!shoe) {
        LogProvider.instance.error(`Shoe not found in db with SKU: ${sku}`);
        notFoundSku.push(sku);
      } else {
        let size = i.shoeSize.toUpperCase();
        if (size.toUpperCase().endsWith("US")) {
          size = size.slice(0, -2);
        }
        if (shoe.gender === "women" && !size.endsWith("W")) {
          size = `${size}W`;
        }
        return {
          shoeId: shoe._id,
          sellerId: i.sellerId,
          shoeSize: size,
          sellPrice: i.sellPrice,
          quantity: i.quantity,
          note: (i as any).link,
        };
      }
      return null;
    });
    const inventories = (await Promise.all(mappedInventories)).filter((t) => t !== null);
    const result = await this.inventoryRepo.insertMany(inventories);
    LogProvider.instance.info(
      `Successfully added ${result.length} inventory entries, not found entries: ${notFoundSku.length}`
    );
  }

  private async _getTHCProdInventory(): Promise<Array<Partial<Inventory>>> {
    const inventories: Array<Partial<Inventory>> = [];
    const thc = await this.profileRepository.findOne({
      userProvidedEmail: "dehype.duco@gmail.com",
    });

    if (!thc) {
      LogProvider.instance.error("Couldn't find THC account");
      process.exit(1);
    }

    return new Promise((resolve, reject) => {
      fs.createReadStream(this.thcSeeds)
        .pipe(csv.parse({ headers: true }))
        .on("data", async (row) => {
          const sku = row["SKU"].toUpperCase();
          let size = row["Size"];
          if (size.endsWith("us") || size.endsWith("US")) {
            size = size.slice(0, -2);
          }
          let price = row["Price"];
          if (typeof price === "string") {
            price = parseInt(price, 10);
          }
          price = Math.round(price / 1000) * 1000;
          const quantity = row["Quantity"];

          const invt = {
            sellerId: thc._id,
            shoeSize: size,
            sellPrice: typeof price === "string" ? parseInt(price, 10) : price,
            quantity: typeof quantity === "string" ? parseInt(quantity, 10) : quantity,
            sku,
          };
          inventories.push(invt);
        })
        .on("error", (err) => {
          LogProvider.instance.error(`Error bootstrapped inventory ${err}`);
          reject(err);
        })
        .on("end", () => {
          resolve(inventories);
        });
    });
  }
}
