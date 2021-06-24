import { inject, injectable } from "inversify";
import { Migration_1624492681744 } from "../../migrations/migration_1624492681744";

@injectable()
export class MigrationProvider {
  @inject(Migration_1624492681744.name)
  private migration_1624492681744: Migration_1624492681744;

  public run(): Promise<any> {
    return Promise.all([this.migration_1624492681744.run()]);
  }
}
