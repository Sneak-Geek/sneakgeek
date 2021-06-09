//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export type ImageType = "Order" | "User";

export interface ICdnService {
  getImageUploadUrls(token: string, count: number, type: ImageType): Promise<string[]>;
  uploadImages(token: string, image: { type: string; uri: string }[]): Promise<string[]>;
}