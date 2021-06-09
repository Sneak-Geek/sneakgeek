import { Catalog } from "../../model";

export interface ICatalogService {
  getAllCatalogs(token: string): Promise<Catalog[] | undefined>;
  createNewCatalog(
    token: string,
    catalog: Partial<Catalog>
  ): Promise<void>;
  saveCatalog(token: string, catalog: Partial<Catalog>, catalogID: string): Promise<void>;
  getCatalogByTag(tag: string): Promise<Catalog>;
}
