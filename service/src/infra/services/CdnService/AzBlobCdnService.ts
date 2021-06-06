//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { ICdnService, CdnContainerName } from "./ICdnService";
import { injectable } from "inversify";
import * as uuid from "uuid";
import MarkdownIt from "markdown-it";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient,
  BlockBlobUploadResponse,
  BlobDeleteResponse,
  generateAccountSASQueryParameters,
  AccountSASPermissions,
} from "@azure/storage-blob";
import { URL } from "url";
import * as stream from "stream";
import { Environment, EnvironmentProvider } from "../../providers";

@injectable()
export class AzBlobCdnService implements ICdnService {
  private readonly azureBlobService: BlobServiceClient;
  private readonly sharedKeyCredential: StorageSharedKeyCredential;
  private readonly azStorageAccount: string = EnvironmentProvider.env.AzStorageAccount;
  private readonly azStorageAccessKey: string = EnvironmentProvider.env.AzStorageAccessKey;
  private readonly azExpireHourLimit: number = EnvironmentProvider.env.AzExpireSasHour;

  // container names
  private readonly articleContainer = EnvironmentProvider.env.AzStorageArticleFolder;
  private readonly userImageContainer = EnvironmentProvider.env.AzStorageUserImg;
  private readonly shoeImageContainer = EnvironmentProvider.env.AzStorageShoeImgFolder;
  private readonly orderImageContainer = EnvironmentProvider.env.AzStorageOrderImgFolder;
  private readonly markdown: MarkdownIt;

  // container client
  private articleContainerClient: ContainerClient = null;
  private userImageContainerclient: ContainerClient = null;
  private shoeImageContainerClient: ContainerClient = null;
  private orderImageContainerClient: ContainerClient = null;

  // base service URL
  private baseUrl = new URL(`https://${this.azStorageAccount}.blob.core.windows.net`);

  // type mapping
  private folderToContainer = new Map<string, { name: string; container: ContainerClient }>(
    [
      [
        CdnContainerName.Order,
        {
          name: this.orderImageContainer,
          container: this.orderImageContainerClient,
        },
      ],
      [
        CdnContainerName.User,
        {
          name: this.userImageContainer,
          container: this.userImageContainerclient,
        },
      ],
      [
        CdnContainerName.Shoe,
        {
          name: this.shoeImageContainer,
          container: this.shoeImageContainerClient,
        },
      ],
      [
        CdnContainerName.Article,
        {
          name: this.articleContainer,
          container: this.articleContainerClient,
        },
      ],
    ]
  );

  constructor() {
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.azStorageAccount,
      this.azStorageAccessKey
    );
    this.azureBlobService = new BlobServiceClient(
      // When using AnonymousCredential, following url should include a valid SAS or support public access
      this.baseUrl.toString(),
      this.sharedKeyCredential
    );
    this.markdown = new MarkdownIt();

    // shoe image container should be already created
    this.shoeImageContainerClient = this.azureBlobService.getContainerClient(
      this.shoeImageContainer
    );
  }

  private async getContainer(type: CdnContainerName): Promise<ContainerClient> {
    let { name, container } = this.folderToContainer.get(type);
    if (!container) {
      container = this.azureBlobService.getContainerClient(name);
    }

    const isContainerExist = await container.exists();
    if (!isContainerExist) {
      await container.create({});
    }

    this.folderToContainer.set(type, { name, container });

    return container;
  }

  public async uploadArticle(
    markdownBody: string,
    markdownKey: string,
    htmlKey: string
  ): Promise<BlockBlobUploadResponse[]> {
    const htmlBody = this.markdown.render(markdownBody);
    return Promise.all([
      this._createBlockBlobFromTextAsync(markdownKey, markdownBody),
      this._createBlockBlobFromTextAsync(htmlKey, htmlBody),
    ]);
  }

  private async _createBlockBlobFromTextAsync(
    blob: string,
    text: string
  ): Promise<BlockBlobUploadResponse> {
    const container = await this.getContainer(CdnContainerName.Article);
    const blockBlobClient = container.getBlockBlobClient(blob);
    return blockBlobClient.upload(text, Buffer.byteLength(text));
  }

  public async getArticle(key: string): Promise<string> {
    const container = await this.getContainer(CdnContainerName.Article);
    const blockBlobClient = container.getBlockBlobClient(key);
    const buffer = await blockBlobClient.downloadToBuffer();
    return buffer.toString();
  }

  public async deleteArticle(
    markdownKey: string,
    htmlKey: string
  ): Promise<BlobDeleteResponse[]> {
    return Promise.all([
      this._deleteArticleBlobAsync(markdownKey),
      this._deleteArticleBlobAsync(htmlKey),
    ]);
  }

  private async _deleteArticleBlobAsync(blob: string): Promise<BlobDeleteResponse> {
    const container = await this.getContainer(CdnContainerName.Article);
    const blockBlobClient = container.getBlockBlobClient(blob);
    return blockBlobClient.delete();
  }

  public async generateSignedLinkForImg(
    type: CdnContainerName.Order | CdnContainerName.User,
    count: number
  ): Promise<string[]> {
    const imagesPromise: Promise<string>[] = [];
    for (let i = 0; i < count; i++) {
      imagesPromise.push(this._generateSingleSignedLinkForImg(type));
    }

    return Promise.all(imagesPromise);
  }

  private async _generateSingleSignedLinkForImg(
    type: CdnContainerName.User | CdnContainerName.Order
  ): Promise<string> {
    // make sure container is created
    await this.getContainer(type);
    const { name } = this.folderToContainer.get(type);

    let startDate = new Date();
    let expiryDate = new Date(startDate);
    expiryDate.setHours(startDate.getHours() + this.azExpireHourLimit);

    const sas = generateAccountSASQueryParameters(
      {
        startsOn: startDate,
        expiresOn: expiryDate,
        permissions: AccountSASPermissions.parse("rwc"),
        resourceTypes: "co",
        services: "bf",
      },
      this.sharedKeyCredential
    );
    const imgName = uuid.v1();

    return `${this.baseUrl.toString()}/${name}/${imgName}?${sas.toString()}`;
  }

  public async generatePermanentDownloadLinkForShoeImg(shoeTitle: string): Promise<string> {
    const shoeFilename = shoeTitle.split(" ").join("_").split("/").join("$") + ".png";
    const container = await this.getContainer(CdnContainerName.Shoe);
    const { name } = this.folderToContainer.get(CdnContainerName.Shoe);
    const imageExists = await container.getBlobClient(shoeFilename).exists();

    if (!imageExists) {
      return "";
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setUTCFullYear(startDate.getUTCFullYear() + 20); // link is valid for 20 years

    const sas = generateAccountSASQueryParameters(
      {
        startsOn: startDate,
        expiresOn: expiryDate,
        permissions: AccountSASPermissions.parse("r"), // read permission
        resourceTypes: "co", // object?
        services: "b", // blob service
      },
      this.sharedKeyCredential
    );

    return `${this.baseUrl.toString()}/${name}/${shoeFilename}?${sas.toString()}`;
  }

  public async uploadImage(containerName: CdnContainerName, fileStream: stream.Readable) {
    const container = await this.getContainer(containerName);
    const generatedFileName = uuid.v1();
    const blockBlobClient = container.getBlockBlobClient(generatedFileName);

    const response = await blockBlobClient.uploadStream(fileStream);
    const uri = blockBlobClient.url.toString();

    return {
      errorCode: response.errorCode,
      httpStatusCode: response._response.status,
      destinationUrl: uri,
      fileName: generatedFileName,
    };
  }
}
