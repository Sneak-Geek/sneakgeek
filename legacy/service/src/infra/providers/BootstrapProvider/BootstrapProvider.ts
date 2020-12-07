import { IBootstrapProvider } from "./IBootstrapProvider";
import { injectable, inject } from "inversify";
import {
  Shoe,
  UserAccount,
  UserProfile,
  Repository,
  Catalogue,
  CatalogType,
  ShoeSchema,
} from "../../database";
import { Types } from "../../../configuration/inversify";
import mongoose, { Document } from "mongoose";
import { AdminAccount, AdminProfile } from "../../../assets/seeds/admin";
import { IShippingService } from "../../services";
import { LogProvider } from "../LogProvider";
import path from "path";
import fs from "fs";

@injectable()
export class BootstrapProvider implements IBootstrapProvider {
  @inject(Types.ShoeRepository) private shoeRepository: Repository<Shoe>;
  @inject(Types.AccountRepository) private accountRepository: Repository<UserAccount>;
  @inject(Types.ProfileRepository) private profileRepository: Repository<UserProfile>;
  @inject(Types.CatalogueRepository) private catalogRepository: Repository<Catalogue>;
  @inject(Types.ShippingService) private shippingService: IShippingService;

  public async bootstrapUsersData(): Promise<any> {
    const adminAccountCreated = await this.accountRepository
      .findOne({ accountEmailByProvider: AdminAccount.accountEmailByProvider })
      .exec();

    if (!adminAccountCreated) {
      LogProvider.instance.info("Creating admin account");

      const seedAdminAccountId = new mongoose.Types.ObjectId();
      const seedAdminProfileId = new mongoose.Types.ObjectId();

      await Promise.all([
        this.accountRepository.create({
          _id: seedAdminAccountId,
          profile: seedAdminProfileId,
          ...AdminAccount,
        }),
        this.profileRepository.create({
          _id: seedAdminProfileId,
          accountId: seedAdminAccountId,
          ...AdminProfile,
        }),
      ]);

      LogProvider.instance.info("Admin account created");
    }

    return null;
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
        .find({ "media.imageUrl": { $ne: "" } })
        .sort({ releaseDate: -1 })
        .limit(15)
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

  public async bootstrapShippingService(): Promise<any> {
    await this.shippingService.initialze();
    this.shippingService.registerWebHookCallback();
    this.shippingService.parseGhnShippingData();
    return;
  }
}
