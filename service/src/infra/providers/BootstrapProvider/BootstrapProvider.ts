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
} from "../../../assets/seeds/user";
import { LogProvider } from "../LogProvider";
import path from "path";
import fs from "fs";
import _ from "lodash";
import { PaymentMethod, TrackingStatus } from "../../../assets/constants";

type AccountInfo = {
  accountId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
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

  public async bootstrapUsersData(): Promise<any> {
    Promise.all([
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

  private async _createUserData(
    credential: SeedCredential,
    account: any,
    profile: any,
    acl: AccessLevel
  ) {
    const count = await this.accountRepository
      .count({ accountEmailByProvider: credential.email })
      .exec();
    if (count === 0) {
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

      this.levelToAccMap.set(acl, { accountId, profileId });
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
    const seedPath = path.join(process.cwd(), "resources", "seeds", "shoes-new.json");
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

  public async bootstrapInventoryAndOrder(): Promise<void> {
    // Already bootstrapped
    if (this.levelToAccMap.size === 0) {
      return;
    }

    const inventories = await this._bootstrapInventory();
    return this._bootstrapOrders(inventories);
  }

  private async _bootstrapInventory(): Promise<Inventory[]> {
    const shoeIds = (
      await this.shoeRepository
        .find({ brand: "Jordan" })
        .sort({ createdAt: -1 })
        .limit(50)
        .exec()
    ).map((s) => s._id);
    const sellerId = this.levelToAccMap.get(AccessLevel.Seller).profileId;
    const rawInventories: Array<Partial<Inventory>> = shoeIds.map((s) => ({
      sellerId,
      shoeId: s,
      shoeSize: "8.5",
      sellPrice: 5000000,
      quantity: 10,
    }));

    return this.inventoryRepo.insertMany(rawInventories);
  }

  private _bootstrapOrders(inventories: Array<Inventory>): Promise<any> {
    const orders = inventories.slice(0, 10).map((inv) => ({
      buyerId: this.levelToAccMap.get(AccessLevel.User).profileId,
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
}
