import { IBootstrapProvider } from "./IBootstrapProvider";
import { injectable, inject } from "inversify";
import {
  Shoe,
  UserAccount,
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
  AdminAccount,
  AdminCredential,
  AdminProfile,
  SeedCredential,
  SellerAccount,
  SellerCredential,
  SellerProfile,
  UserCredential,
  UserRegularAccount,
  UserRegularProfile,
} from "../../../assets/seeds/dev";
import { LogProvider } from "../LogProvider";
import path from "path";
import fs from "fs";
import _ from "lodash";
import { PaymentMethod, TrackingStatus } from "../../../assets/constants";
import * as csv from "fast-csv";
import {
  HeatFactoryAccount,
  HeatFactoryCredential,
  HeatFactoryProfile,
  LuckyStarAccount,
  LuckyStarCredential,
  LuckystarProfile,
  ProdAdminAccount,
  ProdAdminCredential,
  ProdAdminProfile,
} from "../../../assets/seeds/prod";

type AccountInfo = {
  accountId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
};

type InventoryRowData = {
  shop: string;
  sku: string;
  size: string | number;
  price: string | number;
  link: string;
};

@injectable()
export class BootstrapProvider implements IBootstrapProvider {
  constructor(
    @inject(Types.ShoeRepository) private shoeRepository: Repository<Shoe>,
    @inject(Types.AccountRepository) private accountRepository: Repository<UserAccount>,
    @inject(Types.ProfileRepository) private profileRepository: Repository<UserProfile>,
    @inject(Types.CatalogueRepository) private catalogRepository: Repository<Catalogue>,
    @inject(Types.InventoryRepository) private inventoryRepo: Repository<Inventory>,
    @inject(Types.OrderRepository) private orderRepo: Repository<Order>
  ) {}

  private levelToAccMap: Map<AccessLevel, AccountInfo> = new Map();
  private shoeIds: Array<mongoose.Types.ObjectId>;
  private readonly prodInventorySeeds: string = path.join(
    process.cwd(),
    "resources",
    "seeds",
    "inventories-07192021.csv"
  );
  private readonly shops: Map<string, string> = new Map<string, string>();

  public async bootstrapDevUserData(): Promise<any> {
    return Promise.all([
      this._createUserData(AdminCredential, AdminAccount, AdminProfile, AccessLevel.Admin),
      this._createUserData(
        UserCredential,
        UserRegularAccount,
        UserRegularProfile,
        AccessLevel.User
      ),
      this._createUserData(
        SellerCredential,
        SellerAccount,
        SellerProfile,
        AccessLevel.Seller
      ),
    ]);
  }

  public async bootstrapProdUserData(): Promise<any> {
    return Promise.all([
      this._createUserData(
        HeatFactoryCredential,
        HeatFactoryAccount,
        HeatFactoryProfile,
        null
      ),
      this._createUserData(LuckyStarCredential, LuckyStarAccount, LuckystarProfile, null),
      this._createUserData(ProdAdminCredential, ProdAdminAccount, ProdAdminProfile, null),
    ]);
  }

  private async _createUserData(
    credential: SeedCredential,
    account: any,
    profile: any,
    acl: AccessLevel
  ) {
    const found = await this.accountRepository
      .findOne({ accountEmailByProvider: credential.email })
      .exec();
    if (!found) {
      LogProvider.instance.info("Creating account");

      const accountId = new mongoose.Types.ObjectId();
      const profileId = new mongoose.Types.ObjectId();

      await Promise.all([
        this.accountRepository.create({
          _id: accountId,
          profile: profileId,
          ...account,
        }),
        this.profileRepository.create({
          _id: profileId,
          accountId,
          ...profile,
        }),
      ]);

      if (acl) {
        this.levelToAccMap.set(acl, { accountId, profileId });
      } else {
        this.shops.set(profile.userProvidedName.firstName, profileId.toHexString());
      }
    }
  }

  public async bootstrapShoesData(): Promise<any> {
    const count = await this.shoeRepository.countDocuments().exec();

    if (count > 0) {
      return;
    }

    const shoeCount = await this.shoeRepository.estimatedDocumentCount().exec();
    const shoes = this.getRawShoesData();
    this.shoeIds = shoes.map((s) => s._id);

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
    const seller = await this.accountRepository
      .findOne({ accountEmailByProvider: "sneakgeek.test+seller@gmail.com" })
      .exec();
    const shoeIds = (
      await this.shoeRepository
        .find({
          brand: {
            $in: ["Jordan", "Nike", "adidas"],
          },
        })
        .sort({ createdAt: -1 })
        .limit(50)
        .exec()
    ).map((s) => s._id);
    const sellerId = seller.profile as mongoose.Types.ObjectId;
    const rawInventories: Array<Partial<Inventory>> = shoeIds.map((s) => ({
      sellerId,
      shoeId: s,
      shoeSize: "8.5",
      sellPrice: 5000000,
      quantity: 10,
    }));

    return this.inventoryRepo.insertMany(rawInventories);
  }

  private async _bootstrapOrders(inventories: Array<Inventory>): Promise<any> {
    const buyer = await this.accountRepository
      .findOne({ accountEmailByProvider: "sneakgeek.test+user@gmail.com" })
      .exec();
    const orders = inventories.slice(0, 10).map((inv) => ({
      buyerId: buyer.profile as mongoose.Types.ObjectId,
      sellerId: inv.sellerId,
      shoeId: inv.shoeId,
      inventoryId: inv._id,
      shippingAddress: UserRegularProfile.userProvidedAddress,
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
    const rawInventories = await this._getProdInventory();
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

  private _getProdInventory(): Promise<Array<Partial<Inventory>>> {
    const inventories: Array<Partial<Inventory>> = [];

    return new Promise<Array<Partial<Inventory>>>((resolve, reject) => {
      fs.createReadStream(this.prodInventorySeeds)
        .pipe(csv.parse({ headers: true }))
        .on("data", async (row) => {
          const shopName = row["Shop"];
          const sku = row["SKU"].toUpperCase();
          const size = row["Size"];
          const price = row["Price"].split(",").join("");
          const link = row["Link"];

          const invt = {
            sellerId: new mongoose.Types.ObjectId(this.shops.get(shopName)),
            shoeSize: size,
            sellPrice: parseInt(price, 10),
            quantity: 1,
            note: link,
            sku,
          };
          inventories.push(invt);
        })
        .on("error", (err) => {
          LogProvider.instance.error(`Error bootstrapped inventory ${err}`);
          reject(err);
        })
        .on("end", async () => {
          resolve(inventories);
        });
    });
  }
}
