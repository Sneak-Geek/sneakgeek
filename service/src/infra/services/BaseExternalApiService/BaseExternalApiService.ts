import axios, { AxiosInstance } from "axios";
import { injectable } from "inversify";
import { EnvironmentProvider } from "../../providers";

@injectable()
export abstract class BaseExternalApiService {
  protected apiClient: AxiosInstance;
  private readonly timeout: number =
    EnvironmentProvider.env.ExternalServiceTimeout * 60 * 1000;

  protected constructor() {
    this.apiClient = axios.create({
      timeout: this.timeout,
    });
  }
}
