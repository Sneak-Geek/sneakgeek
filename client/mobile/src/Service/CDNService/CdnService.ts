//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { ICdnService } from "./ICdnService";
import ApiClient from "../ApiClient";
import { injectable } from "inversify";
import { Platform } from "react-native";
import RNFetchBlob, { FetchBlobResponse } from "rn-fetch-blob";

@injectable()
export class CdnService implements ICdnService {
  public async /** override **/ getImageUploadUrls(token: string, count: number): Promise<string[]> {
    const headers = { authorization: token };
    const response = await ApiClient.get(`/image?count=${count}&type=User`, {
      headers
    });

    return response.data;
  }

  public async uploadImage(localUri: string, remoteUri: string, filetype: string): Promise<FetchBlobResponse> {
    localUri = Platform.OS === "ios" ? localUri.replace("file://", "") : localUri;

    return RNFetchBlob.fetch(
      "PUT",
      remoteUri,
      {
        "x-ms-blob-type": "BlockBlob",
        "content-type": "application/octet-stream",
        "x-ms-blob-content": filetype
      },
      RNFetchBlob.wrap(localUri)
    );
  }
}
