import { Response } from "express";
import httpStatus from "http-status";
import { controller, httpGet, response } from "inversify-express-utils";

@controller("/_ah/warmup")
export class WarmupController {
  // TODO(hoangpham95): more logic to handle inbound warmup
  @httpGet("/")
  public async warmup(@response() res: Response) {
    return res.status(httpStatus.OK).send();
  }
}
