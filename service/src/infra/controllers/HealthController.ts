import { Response } from "express";
import { controller, httpGet, response } from "inversify-express-utils";

@controller("/api/v1/health")
export class HealthController {
  @httpGet("/")
  public async healthCheck(@response() res: Response) {
    return res.status(200).send();
  }
}
