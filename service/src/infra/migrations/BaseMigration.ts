import { injectable } from "inversify";

@injectable()
export abstract class BaseMigration {
  public abstract run(): Promise<void>;
}
