import {
  BalanceHistory,
  BalanceHistoryStatus,
  BankingInfo,
  BalanceHistoryAction,
  PopulatedBalanceHistory,
} from "../../database";
import { ObjectId } from "mongodb";

export interface IBalanceHistoryDao {
  findByBalanceHistoryId(balanceHistoryId: string | ObjectId): Promise<BalanceHistory>;
  createDepositHistory(
    profileId: string | ObjectId,
    amount: number,
    transactionId: string | ObjectId,
    prevBalance: number,
    shoeId: string | ObjectId
  ): Promise<void>;
  createWithdrawalHistory(
    profileId: string | ObjectId,
    amount: number,
    bankingInfo: BankingInfo
  ): Promise<void>;
  updateBalance(
    balanceHistoryId: string | ObjectId,
    updateFilter: {
      status: BalanceHistoryStatus;
      prevBalance?: number;
    }
  ): Promise<void>;
  getBalanceHistories(filter: {
    profileId: string | ObjectId;
    action?: BalanceHistoryAction;
    status?: BalanceHistoryStatus;
  }): Promise<Array<PopulatedBalanceHistory> | undefined>;
  populate(buyOrder: any): Promise<any>;
}
