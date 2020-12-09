import { NextFunction, Response, Request } from "express";
import HttpStatus from "http-status";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { Types } from "../../configuration/inversify";
import { ProfileDao } from "../dao";
import { UserAccount } from "../database";

@injectable()
export class IsSellerMiddleware extends BaseMiddleware {
  @inject(Types.ProfileDao)
  private readonly profileDao!: ProfileDao;

  public async handler(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserAccount;
    const profile = await this.profileDao.findByAccountId(user.id);

    if (!profile) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Profile not found",
      });
    }

    if (!profile.isSeller) {
      return res.status(HttpStatus.FORBIDDEN).send({
        message: "Profile is not seller",
      });
    }

    return next();
  }
}
