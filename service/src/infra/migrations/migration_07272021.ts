import { inject, injectable } from "inversify";
import { Types } from "../../configuration/inversify";
import { Repository, Shoe } from "../database";
import { LogProvider } from "../providers";
import { BaseMigration } from "./BaseMigration";

@injectable()
export class Migration_07272021 extends BaseMigration {
  private defaultSneakGeekUrl =
    "https://storage.googleapis.com/sneakgeek-images/sneakgeek-default-image.png";
  private stockxUrlRegExp = /placeholder/i;
  constructor(@inject(Types.ShoeRepository) private shoeRepo: Repository<Shoe>) {
    super();
  }

  public async run() {
    try {
      const defaultStockxImage = await this.shoeRepo
        .find({
          "media.thumbUrl": this.stockxUrlRegExp,
        })
        .exec();

      if (defaultStockxImage.length > 0) {
        LogProvider.instance.info("Found default image from stockx, editing...");
        await this.shoeRepo
          .updateMany(
            { "media.thumbUrl": this.stockxUrlRegExp },
            {
              $set: {
                media: {
                  imageUrl: this.defaultSneakGeekUrl,
                  thumbUrl: this.defaultSneakGeekUrl,
                  smallImageUrl: this.defaultSneakGeekUrl,
                  hidden: false,
                },
              },
            }
          )
          .exec();
      }
    } catch (error) {
      LogProvider.instance.error(`Error migrating from Stockx images ${error}`);
    }
  }
}
