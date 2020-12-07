//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Transaction, UserProfile, TrackingStatusEnum } from "../../database";
import { ObjectId } from "mongodb";
import { PaymentStatus } from "../../../assets/constants";

export interface TransactionCreateInput {
  sellOrderId: ObjectId;
  buyOrderId: ObjectId;
  feeBreakdown: {
    productPrice: number;
    estimatedShippingFeeFromSellerToSnkg: number;
    estimatedShippingFeeFromSnkgToBuyer: number;
  };
}

export interface ITransactionDao {
  /**
   * @description Create a new Transaction
   *
   * @param {TransactionCreateInput} input
   */
  create(input: TransactionCreateInput): Promise<Transaction>;

  /**
   * @description Find all pending authentication Transactions
   *
   * @returns {Promise<Transaction[]>} All pending authentication Transactions
   * @throws Error if database operation fails
   */
  findPendingAuthentication(): Promise<Transaction[]>;

  /**
   * @description Find a transaction by ID
   *
   * @returns {Promise<Transaction | undefined>} a transaction
   */
  findById(transactionId: string): Promise<Transaction | undefined>;

  /**
   * @description Find transactions by sell order id
   *
   * @param {ObjectId} sellOrderId
   */
  findBySellOrderId(sellOrderId: ObjectId): Promise<Transaction[] | undefined>;

  /**
   * @description Update transaction authentitcation status
   *
   * @returns {Promise<Transaction | undefined>} Return the original document if update sucessfully, undefined if not
   * @throws Error if database operation fails
   */
  updateAuthenticationStatus(
    transactionId: string,
    authenticationStatus: string,
    description: string
  ): Promise<Transaction | undefined>;

  /**
   * @description Update transaction payment status
   *
   * @param {ObjectId | string} transactionId
   * @param {{status: PaymentStatus, message?: string}} paymentStatus
   */
  updatePaymentStatus(
    transactionId: ObjectId | string,
    paymentStatus: { status: PaymentStatus; message?: string }
  ): Promise<void>;

  updateTrackingStatusByTransactionId(
    transactionId: string,
    status: string,
    description?: string,
    failureCode?: number
  ): Promise<Transaction>;

  /**
   * Update transaction when shipping order is created
   *
   * @param {Transaction} transaction
   * @param {any} shippingOrder
   */
  updateOnShippingOrderCreated(
    transaction: Transaction,
    shippingOrder: any
  ): Promise<Transaction | undefined>;
}
