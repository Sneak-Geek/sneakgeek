import { ContainerClient } from "@azure/storage-blob";
import { CdnContainerName } from "./ICdnService";

export interface IContainerClientMetadata {
  containerName: string;
  containerClient: ContainerClient;
}

export class StorageContainerFactory {
  public getContainer(name: CdnContainerName) {}
}
