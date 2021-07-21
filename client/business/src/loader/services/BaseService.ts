import { ApiClient, Instance } from "./ApiClient";
import { ObjectFactory, FactoryKeys } from "../kernel";
import { IEnvVar } from "../interfaces";

export abstract class BaseService {
  protected apiClient: Instance;

  public constructor() {
    const env: IEnvVar = ObjectFactory.getObjectInstance<IEnvVar>(FactoryKeys.IEnvVar);

    this.apiClient = new ApiClient.Builder()
    .registerApiEndpoint(env.apiEndpoint)  
    .build();
  }
}
