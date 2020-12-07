import { BaseService } from "./BaseService";
import HttpStatus from "http-status";
import { Catalog } from "../../model";
import { ICatalogService } from "../interfaces";

export class CatalogService extends BaseService implements ICatalogService {
  public async getAllCatalogs(token: string): Promise<Catalog[] | undefined> {
    const response = await this.apiClient.getInstance().get(`/catalogue/all`, {
      headers: {
        authorization_token: token,
      },
    });

    if (
      response &&
      (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)
    ) {
      return response.data;
    }
    return undefined;
  }

  public async saveCatalog(
    token: string,
    catalog: Partial<Catalog>,
    catalogID: string
  ): Promise<void> {
    await this.apiClient.getInstance().put(`/catalogue/${catalogID}`, catalog, {
      headers: {
        authorization_token: token,
      },
    });
  }

  public async createNewCatalog(
    token: string,
    catalog: Partial<Catalog>
  ): Promise<void> {
    await this.apiClient.getInstance().post(
      `/catalogue/`,
      {
        title: catalog.title,
        productIds: catalog.productIds,
        description: catalog.description,
        catalogType: catalog.catalogType,
        coverImage: catalog.coverImage || '',
      },
      {
        headers: {
          authorization_token: token,
        },
      }
    );
  }

  public async getCatalogByTag(tag: string): Promise<Catalog> {
    const response = await this.apiClient.getInstance().get(`/catalogue?tag=${tag}`);

    return response.data.catalog;
  }
}
