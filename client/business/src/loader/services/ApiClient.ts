//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import axios, { AxiosInstance } from "axios";

export class Builder {
  private apiEndpoint!: string;

  public registerApiEndpoint(endpoint: string): Builder {
    this.apiEndpoint = endpoint;
    return this;
  }
  public build(): Instance {
    return new Instance(
      axios.create({
        baseURL: this.apiEndpoint,
        timeout: 5 * 1000 * 60
      })
    );
  }
}
export class Instance {
  private axiosInstance: AxiosInstance | undefined;

  public constructor(axiosIsnt: AxiosInstance) {
    this.axiosInstance = axiosIsnt;
  }

  public getInstance(): AxiosInstance {
    if (this.axiosInstance === undefined) {
      throw new Error("Axios instance is not properly configured");
    }

    return this.axiosInstance;
  }

  public getUrl() {
    return this.axiosInstance?.defaults.baseURL;
  }
}

export const ApiClient = {
  Builder,
  Instance
};
