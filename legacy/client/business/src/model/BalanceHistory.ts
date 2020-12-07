import { Shoe } from "./Shoe"

export enum BalanceHistoryStatus {
    PROCESSING = "PROCESSING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
}

export enum BalanceHistoryAction {
    WITHDRAW = "WITHDRAW",
    DEPOSIT = "DEPOSIT",
}

export type BankingInfo = {
    bankName: string,
    accountNumber: string,
    accountHolderName: string,
    lastFourDigits: string
}

export type BalanceHistory = {
    _id: string;
    profileId: string;
    transactionId: string;
    prevBalance: number;
    amount: number;
    status: BalanceHistoryStatus;
    action: BalanceHistoryAction;
    bankingInfo: BankingInfo;
    updatedAt: Date;
    createdAt: Date;
    shoe?: Shoe;
}