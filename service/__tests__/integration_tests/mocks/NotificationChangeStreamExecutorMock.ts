import { INotificationChangeStreamExecutor } from "../../../src/infra/executor";
import { injectable } from "inversify";

@injectable()
export class NotificationChangeStreamExecutorMock
  implements INotificationChangeStreamExecutor {
  executeOnNotificationInsert(data: any): Promise<void> {
    return;
  }
}
