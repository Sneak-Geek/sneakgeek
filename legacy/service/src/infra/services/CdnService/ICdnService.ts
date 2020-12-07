// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as AzureStorage from "@azure/storage-blob";
import { Stream } from "stream";

export enum CdnContainerName {
  Article = "Article",
  Order = "Order",
  User = "User",
  Shoe = "Shoe",
}

export interface IUploadResponse {
  errorCode?: string;
  httpStatusCode: number;
  fileName?: string;
  destinationUrl?: string;
}

export interface ICdnService {
  uploadArticle(
    markdownBody: string,
    markdownKey: string,
    htmlKey: string
  ): Promise<AzureStorage.BlockBlobUploadResponse[]>;
  getArticle(key: string): Promise<string>;
  deleteArticle(
    markdownKey: string,
    htmlKey: string
  ): Promise<AzureStorage.BlobDeleteResponse[]>;
  generateSignedLinkForImg(
    type: CdnContainerName.User | CdnContainerName.Order,
    count: number
  ): Promise<string[]>;
  /*
   * Generate permanent (20 years) download link for shoe img given shoeTitle
   * key stored on AzureBlobStorage = shoeTitle.replace(" ", "_").replace("/", "$") + .png
   * shoeTitle should not be null/undefined
   *
   * return Promise that resolves to downloadable link if we have img else ""
   */
  generatePermanentDownloadLinkForShoeImg(shoeTitle: string): Promise<string>;
  uploadImage(container: CdnContainerName, fileStream: Stream): Promise<IUploadResponse>;
}
