//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { ICdnService, ImageType } from "./ICdnService";
import { BaseService } from "../BaseService";

export class CdnService extends BaseService implements ICdnService {
  public async getImageUploadUrls(token: string, count: number, type: ImageType): Promise<string[]> {
    const headers = { authorization: token };
    const response = await this.apiClient.getInstance().get(`/image?count=${count}&type=${type}`, {
      headers
    });

    return response.data;
  }

  public async uploadImages(token: string, images: { type: string; uri: string }[]): Promise<string[]> {
    const data = new FormData();

    images.forEach((image, index) => data.append("images", {
      type: image.type,
      // @ts-ignore
      uri: image.uri,
      name: index.toString()
    }));

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'multipart/form-data');
    requestHeaders.set('Authorization', token);

    const response = await fetch(`${this.apiClient.getUrl()}/image/upload`, {
      method: 'POST',
      headers: requestHeaders,
      body: data,
    });

    const result = await response.json();
    return result.urls as string[];
  }
}