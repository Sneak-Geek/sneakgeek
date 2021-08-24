import { inject } from "inversify";
import { Types } from "../../configuration/inversify";
import { Repository, UserProfile } from "../database";
import { LogProvider } from "../providers";
import { BaseMigration } from "./BaseMigration";

export class Migration_08242021 extends BaseMigration {
  constructor(
    @inject(Types.ProfileRepository) private profileRepo: Repository<UserProfile>
  ) {
    super();
  }

  public async run(): Promise<void> {
    const result = await this.profileRepo
      .deleteMany({ firebaseAccountId: { $exists: false } })
      .exec();
    LogProvider.instance.info(`Deleted ${result.deletedCount} stale accounts`);
  }
}
