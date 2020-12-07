// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Response } from "express";
import * as HttpStatus from "http-status";
import { controller, httpGet, response } from "inversify-express-utils";
import * as Settings from "../../assets/settings";
import { AuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import { FAQ } from "../../assets/constants";
import { IShippingService } from "../services";
import { inject } from "inversify";
import { Types } from "../../configuration/inversify";
import { Repository, Shoe } from "../database";

@controller("/api/v1/settings")
export class SettingsController {
  @inject(Types.ShippingService) private shippingService: IShippingService;
  @inject(Types.ShoeRepository)
  private readonly shoeRepo: Repository<Shoe>;

  @httpGet("/shipping")
  public async getAvailableDistricts(@response() res: Response) {
    try {
      const { districts, wards } = this.shippingService.serializeShippingData();

      return res.status(HttpStatus.OK).send({
        districts,
        wards: JSON.stringify([...wards]),
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error",
        error,
      });
    }
  }

  @httpGet("/")
  public async getAppSetting(@response() res: Response) {
    const brands = await this.shoeRepo.distinct("brand").exec();

    return res.status(HttpStatus.OK).send({
      shoeConditions: Settings.ShoeCondition,
      boxConditions: Settings.ShoeBoxCondition,
      sellDuration: Settings.SellDurationSettings,
      shoeSizes: Settings.ShoeSize,
      genders: Settings.Gender,
      shoeBrands: brands,
      shoeSizeStandards: Settings.ShoeSizeStandard,
      faq: FAQ,
    });
  }
}
