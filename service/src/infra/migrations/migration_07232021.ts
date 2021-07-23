import { inject, injectable } from "inversify";
import { Types } from "../../configuration/inversify";
import { Inventory } from "../database/Inventory";
import { Repository } from "../database/Repository";
import { BaseMigration } from "./BaseMigration";
import mongoose from "mongoose";

@injectable()
export class Migration_07232021 extends BaseMigration {
  constructor(
    @inject(Types.InventoryRepository) private inventoryRepository: Repository<Inventory>
  ) {
    super();
  }

  public async run() {
    this.inventoryRepository.deleteMany({
      createdAt: {
        $lt : new Date(2021,7,17)
      },
    }).then(function(){
      console.log("Old Inventory Deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
    const inventoriesWithoutShoeInfo = await this.inventoryRepository.aggregate([
      {
        $match: {
          $or: [{ shoeInfo: null }, { shoeInfo: { $exists: false } }],
        },
      },
      {
        $lookup: {
          from: "shoes",
          localField: "shoeId",
          foreignField: "_id",
          as: "shoe",
        },
      },
      {
        $unwind: { path: "$shoe" },
      },
    ]);

    if (inventoriesWithoutShoeInfo.length > 0) {
      await Promise.all(
        inventoriesWithoutShoeInfo.map((inv) => {
          if (inv.createdAt > new Date(2021,7,17))
          {
            return this.inventoryRepository.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(inv._id) },
              {
                $set: {
                  shoeInfo: {
                    title: inv.shoe.title,
                    brand: inv.shoe.brand,
                    category: inv.shoe.category,
                    gender: inv.shoe.gender,
                    name: inv.shoe.name,
                    thumbnail: inv.shoe.media?.thumbUrl,
                  },
                },
              }
            );
          }
        })
      );
    }
  }
}
