import { inject, injectable } from "inversify";
import { Types } from "../../configuration/inversify";
import { Inventory } from "../database/Inventory";
import { Repository } from "../database/Repository";
import { BaseMigration } from "./BaseMigration";
import { LogProvider } from "../providers/LogProvider";

@injectable()
export class Migration_07232021 extends BaseMigration {
  constructor(
    @inject(Types.InventoryRepository) private inventoryRepository: Repository<Inventory>
  ) {
    super();
  }

  public async run() {
    try { 
      const result = await this.inventoryRepository.deleteMany({
        createdAt: {
          $lt: new Date(2021, 7, 17) 
        },
      }).exec(); 
      LogProvider.instance.info(`Deleted result ${result}`); 
    } 
    catch (error) { 
      LogProvider.instance.error("Failed to delete old repository."); 
    }
  }
}
