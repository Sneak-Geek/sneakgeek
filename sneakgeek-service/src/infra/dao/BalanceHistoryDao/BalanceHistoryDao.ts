import { injectable, inject } from "inversify";
import { Types } from "../../../configuration/inversify";
import { IBalanceHistoryDao } from "./IBalanceHistoryDao";
import {
  BalanceHistory,
  Repository,
  BalanceHistoryAction,
  BalanceHistoryStatus,
  BankingInfo,
  PopulatedBalanceHistory,
} from "../../database";
import { ObjectId } from "mongodb";

@injectable()
export class BalanceHistoryDao implements IBalanceHistoryDao {
  @inject(Types.BalanceHistoryRepository)
  private readonly balanceHistoryRepo!: Repository<BalanceHistory>;

  public findByBalanceHistoryId(
    balanceHistoryId: string | ObjectId
  ): Promise<BalanceHistory> {
    return this.balanceHistoryRepo.findOne({ _id: balanceHistoryId }).exec();
  }

  public async createDepositHistory(
    profileId: string | ObjectId,
    amount: number,
    transactionId: string | ObjectId,
    prevBalance: number,
    shoeId: string | ObjectId
  ): Promise<void> {
    await this.balanceHistoryRepo.create({
      profileId,
      amount,
      transactionId,
      status: BalanceHistoryStatus.SUCCEEDED,
      prevBalance,
      action: BalanceHistoryAction.DEPOSIT,
      shoeId,
    });
  }

  public async createWithdrawalHistory(
    profileId: string | ObjectId,
    amount: number,
    bankingInfo: BankingInfo
  ): Promise<void> {
    await this.balanceHistoryRepo.create({
      profileId,
      amount,
      status: BalanceHistoryStatus.PROCESSING,
      bankingInfo,
      action: BalanceHistoryAction.WITHDRAW,
    });
  }

  public async updateBalance(
    balanceHistoryId: string | ObjectId,
    updateFilter: {
      status: BalanceHistoryStatus;
      prevBalance?: number;
    }
  ): Promise<void> {
    await this.balanceHistoryRepo.findOneAndUpdate({ _id: balanceHistoryId }, updateFilter);
  }

  public async getBalanceHistories(filter: {
    profileId: string | ObjectId;
    action?: BalanceHistoryAction;
    status?: BalanceHistoryStatus;
  }): Promise<Array<PopulatedBalanceHistory> | undefined> {
    const balanceHistories = await this.balanceHistoryRepo
      .find(filter)
      .sort({ updatedAt: -1 })
      .exec();
    return this.populate(balanceHistories);
  }

  public async populate(balanceHistory: any): Promise<any> {
    return this.balanceHistoryRepo.populate(balanceHistory, {
      path: "shoe",
    });
  }
}
