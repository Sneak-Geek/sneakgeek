export interface INotificationChangeStreamExecutor {
  executeOnNotificationInsert(data: any): Promise<void>;
}
