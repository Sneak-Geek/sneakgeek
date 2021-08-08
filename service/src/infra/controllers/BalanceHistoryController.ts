import { controller, httpGet, request, response, httpPost } from "inversify-express-utils";
import {
  FirebaseAuthMiddleware,
  ValidationPassedMiddleware,
  AdminPermissionMiddleware,
} from "../middlewares";
import * as express from "express";
import { inject } from "inversify";
import { IProfileDao, IShoeDao } from "../dao";
import HttpStatus from "http-status";
import { IBalanceHistoryDao } from "../dao/BalanceHistoryDao/IBalanceHistoryDao";
import { Types } from "../../configuration/inversify/inversify.types";
import { body, query } from "express-validator";
import { BankingInfo, BalanceHistoryAction, BalanceHistoryStatus } from "../database";
import { ObjectId } from "mongodb";
import { plainToClass } from "@marcj/marshal";
import { GetBalanceHistoryFilter } from "../model";

@controller("/api/v1/balance-history")
export class BalanceHistoryController {
  @inject(Types.ProfileDao)
  private readonly profileDao!: IProfileDao;

  @inject(Types.BalanceHistoryDao)
  private readonly balanceHistoryDao!: IBalanceHistoryDao;

  @inject(Types.ShoeDao)
  private readonly shoeDao!: IShoeDao;

  @httpGet(
    "/",
    query("status").isIn(Object.keys(BalanceHistoryStatus)).optional(),
    query("action").isIn(Object.keys(BalanceHistoryAction)).optional(),
    FirebaseAuthMiddleware,
    ValidationPassedMiddleware
  )
  public async getBalancetHistories(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const profileId: ObjectId | string = req.user.profile;
    const getBalanceHistoryFilter = plainToClass(GetBalanceHistoryFilter, {
      ...req.query,
      profileId,
    }) as {
      profileId: string | ObjectId;
      action?: BalanceHistoryAction;
      status?: BalanceHistoryStatus;
    };
    const balanceHistories = await this.balanceHistoryDao.getBalanceHistories(
      getBalanceHistoryFilter
    );
    return res.status(HttpStatus.OK).send(balanceHistories);
  }

  @httpPost(
    "/withdraw",
    body("amount").exists().isNumeric(),
    body("bankName").exists().isString(),
    body("accountNumber").exists().isString(),
    body("accountHolderName"),
    FirebaseAuthMiddleware,
    ValidationPassedMiddleware
  )
  public async createWithdrawalHistory(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const { amount, bankName, accountNumber, accountHolderName } = req.body;
    const profileId = req.user.profile;
    const getProcessingWithdrawal = (
      await this.balanceHistoryDao.getBalanceHistories({
        profileId,
        status: BalanceHistoryStatus.PROCESSING,
        action: BalanceHistoryAction.WITHDRAW,
      })
    )[0];
    let currentBalance = await this._getCurrentBalance(profileId);

    if (getProcessingWithdrawal || (currentBalance <= 0 && amount > currentBalance)) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Bad request!" });
    }

    const accountNumberLength = accountNumber.length;
    const lastFourDigits = accountNumber.substring(
      accountNumberLength - 4,
      accountNumberLength
    );

    const bankingInfo = {
      bankName,
      accountNumber,
      accountHolderName,
      lastFourDigits,
    } as BankingInfo;
    await this.balanceHistoryDao.createWithdrawalHistory(profileId, amount, bankingInfo);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Successfully created withdraw history!" });
  }

  //Need Admin Permission - Used for testing
  @httpPost(
    "/deposit",
    body("amount").exists().isNumeric(),
    body("transactionId").exists().isString(),
    body("profileId").exists().isString(),
    body("shoeId").exists().isString(),
    FirebaseAuthMiddleware,
    AdminPermissionMiddleware,
    ValidationPassedMiddleware
  )
  public async createDepositHistory(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const { amount, transactionId, profileId, shoeId } = req.body;
    let prevBalance = await this._getCurrentBalance(profileId);
    await this.balanceHistoryDao.createDepositHistory(
      profileId,
      amount,
      transactionId,
      prevBalance,
      shoeId
    );
    return res
      .status(HttpStatus.OK)
      .send({ message: "Successfully created deposit history" });
  }

  @httpPost(
    "/update-balance-history",
    body("balanceHistoryId").exists().isMongoId(),
    body("status").exists().isIn(Object.keys(BalanceHistoryStatus)),
    FirebaseAuthMiddleware,
    AdminPermissionMiddleware,
    ValidationPassedMiddleware
  )
  public async updateBalance(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const profileId = req.user.profile;
    const { balanceHistoryId, status } = req.body;
    const balanceHistory = await this.balanceHistoryDao.findByBalanceHistoryId(
      balanceHistoryId
    );

    let updateFilter: {
      status: BalanceHistoryStatus;
      prevBalance?: number;
    } = { status };
    if (status === BalanceHistoryStatus.SUCCEEDED) {
      const prevBalance = await this._getCurrentBalance(profileId);
      updateFilter = { status, prevBalance };
    }

    if (!(balanceHistory.status === BalanceHistoryStatus.PROCESSING)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Existed balance status cannot be changed!" });
    }

    await this.balanceHistoryDao.updateBalance(balanceHistoryId, updateFilter);
    return res
      .status(HttpStatus.OK)
      .send({ message: "Successfully updated balance history" });
  }

  private async _getCurrentBalance(profileId: string | ObjectId): Promise<number> {
    const mostRecentSucceededBalanceHistory = (
      await this.balanceHistoryDao.getBalanceHistories({
        profileId,
        status: BalanceHistoryStatus.SUCCEEDED,
      })
    )[0];
    if (!mostRecentSucceededBalanceHistory) {
      return 0;
    }
    return mostRecentSucceededBalanceHistory.action === BalanceHistoryAction.DEPOSIT
      ? mostRecentSucceededBalanceHistory.prevBalance +
          mostRecentSucceededBalanceHistory.amount
      : mostRecentSucceededBalanceHistory.prevBalance -
          mostRecentSucceededBalanceHistory.amount;
  }
}
