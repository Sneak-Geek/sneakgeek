import { ApiClient, Instance } from "./ApiClient";
import { ObjectFactory, FactoryKeys } from "../kernel";
import { IEnvVar } from "../interfaces";

export abstract class BaseService {
  protected apiClient: Instance;

  public constructor() {
    const env: IEnvVar = ObjectFactory.getObjectInstance<IEnvVar>(FactoryKeys.IEnvVar);

    this.apiClient = new ApiClient.Builder()
      .registerDevState(env.dev)
      .registerDevUrl(env.devUrl || "https://localhost:8080/api/v1")
      .registerProdUrl(env.prodUrl || "https://sneakgeek-test.azurewebsites.net/api/v1")
      .build();
  }
}
