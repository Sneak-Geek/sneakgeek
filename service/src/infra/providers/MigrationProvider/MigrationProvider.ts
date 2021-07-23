import { inject, injectable } from "inversify";
import { Migration_1624492681744 } from "../../migrations/migration_1624492681744";
import { Migration_07232021 } from "../../migrations/migration_07232021";

@injectable()
export class MigrationProvider {
  @inject(Migration_1624492681744.name)
  private migration_1624492681744: Migration_1624492681744;

  @inject(Migration_07232021.name)
  private migration_07232021: Migration_07232021;

  public run(): Promise<any> {
    if (process.env.NODE_ENV === "prod")
    {
      return Promise.all([this.migration_07232021.run(), this.migration_1624492681744.run()]);
    }
    else
    {
      return Promise.all([this.migration_1624492681744.run()]);
    }
  }
}
