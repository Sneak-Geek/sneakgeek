//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { BuyOrder, SellOrder, PopulatedBuyOrder } from "../../database";
import { ObjectId } from "mongodb";

export interface BuyOrderNewShoeCreateInput {
  buyerId: ObjectId | string;
  buyPrice: number;
  shoeId: ObjectId | string;
  shoeSize: string;
}

export interface BuyOrderUsedShoeCreateInput extends BuyOrderNewShoeCreateInput {
  sellOrderId: ObjectId | string;
}

export interface IBuyOrderDao {
  /**
   * Create BuyOrder for new shoe
   *
   * @param {BuyOrderNewShoeCreateInput} input
   */
  createBuyOrderNewShoe(input: BuyOrderNewShoeCreateInput): Promise<BuyOrder>;

  /**
   * Create BuyOrder for used shoe
   *
   * @param {BuyOrderUsedShoeCreateInput} input
   */
  createBuyOrderUsedShoe(input: BuyOrderUsedShoeCreateInput): Promise<BuyOrder>;

  /**
   * Create BuyOrder from SellOrder
   *
   * @param {SellOrder} sellOrder
   */
  createBuyOrderFromSellOrder(buyerId: string, sellOrder: SellOrder): Promise<BuyOrder>;

  /**
   * @description Find BuyOrder by id
   *
   * @param {ObjectId | string} buyOrderId
   */
  findById(buyOrderId: ObjectId | string): Promise<BuyOrder | undefined>;

  /**
   * @description Find and return populated BuyOrder by buyOrderId
   *
   * @param {string} buyOrderId
   * @returns {Promise<BuyOrder | undefined>} Return populated BuyOrder if there is
   * any BuyOrder matches. Otherwise return undefined.
   * @throws Error if database operation fails
   */
  findByIdAndPopulate(buyOrderId: string): Promise<BuyOrder | undefined>;

  /**
   * @description Find and populate BuyOrder created by buyer
   *
   * @param {string} buyerId
   */
  findByBuyerIdAndPopulate(buyerId: string): Promise<PopulatedBuyOrder[]>;

  /**
   * Find BuyOrders that match the price of given SellOrder
   *
   * @param {SellOrder} sellOrder
   */
  findMatchingPriceBuyOrderWithBuyer(sellOrder: SellOrder): Promise<PopulatedBuyOrder[]>;

  /**
   * @description Delete BuyOrder and the associated PriceData from database
   *
   * @param {string} buyOrderId
   * @returns {Promise<BuyOrder | undefined} If there is any BuyOrder match, delete it
   * and the associated PriceData document from database and return BuyOrder document.
   * Else return undefined.
   * @throws Error if any database operation fail
   */
  destroyById(buyOrderId: string | ObjectId): Promise<BuyOrder | undefined>;

  /**
   * @description Update BuyOrder status
   *
   * @param {ObjectId | string} buyOrderId
   * @param {string} newStatus
   */
  updateStatusById(
    buyOrderId: ObjectId | string,
    newStatus: string
  ): Promise<BuyOrder | undefined>;

  /**
   * @description Find all BuyOrder in database
   *
   * @returns {Promise<BuyOrder[]>} All BuyOrder in database
   * @throws Error if database operation fail
   */
  findAll(): Promise<BuyOrder[]>;

  /**
   * @description Find approved highest price BuyOrder by shoeId
   *
   * @param {string} shoeId
   */
  findHighestBuyOrderByShoeId(shoeId: string): Promise<BuyOrder | undefined>;

  /**
   * @description Find approved highest price BuyOrder by shoeId and shoeSize
   *
   * @param {string} shoeId
   * @param {string} shoeSize
   */
  findHighestBuyOrderByShoeIdAndShoeSize(
    shoeId: string,
    shoeSize: string
  ): Promise<BuyOrder | undefined>;
  findHighestBuyPriceSizeMap(shoeId: string): Promise<{ price: number; size: string }[]>;

  /**
   * Update BuyOrder transactionId field
   *
   * @param {ObjectId} buyOrderId
   * @param {ObjectId} transactionId
   */
  updateTransactionId(
    buyOrderId: ObjectId,
    transactionId: ObjectId
  ): Promise<BuyOrder | undefined>;

  /**
   * Populate a BuyOrder
   *
   * @param {BuyOrder} buyOrder
   */
  populate(buyOrder: BuyOrder): Promise<PopulatedBuyOrder>;

  /**
   * Populate an array of BuyOrders
   *
   * @param {BuyOrder[]} buyOrders
   */
  populate(buyOrders: BuyOrder[]): Promise<PopulatedBuyOrder[]>;
}
