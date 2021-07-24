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
    const migrations = [this.migration_1624492681744.run()]; 
    if (process.env.NODE_ENV === "prod") {
      migrations.push(this.migration_07232021.run());
    } 
    return Promise.all(migrations);
  }
}
