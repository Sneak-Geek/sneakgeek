//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { BaseMiddleware } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { Types } from "../../configuration/inversify";
import { ICdnService, CdnContainerName } from "../services";
import { Request, Response, NextFunction } from "express";
import multer, { StorageEngine } from "multer";
import * as Stream from "stream";

@injectable()
export class AzCdnMulterMiddlware extends BaseMiddleware implements StorageEngine {
  @inject(Types.CdnService)
  private readonly cdnService!: ICdnService;

  public handler(req: Request, res: Response, next: NextFunction): void {
    return multer({ storage: this }).array("images")(req, res, next);
  }

  public async _handleFile(
    _req: Request,
    file: Express.Multer.File & { stream: Stream.Readable },
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ): Promise<void> {
    try {
      const response = await this.cdnService.uploadImage(
        CdnContainerName.User,
        file.stream
      );
      callback(null, {
        destination: response.destinationUrl,
      });
    } catch (error) {
      callback(error, null);
    }
  }
  public _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error) => void
  ): void {
    throw new Error("Method not implemented.");
  }
}
