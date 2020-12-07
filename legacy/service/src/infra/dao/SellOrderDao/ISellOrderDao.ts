//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { SellOrder, PopulatedSellOrder } from "../../database";
import { ObjectId } from "mongodb";

export interface SellOrderNewShoeCreateInput {
  sellerId: string;
  shoeId: string;
  shoeSize: string;
  sellPrice: number;
}

export interface SellOrderUsedShoeCreateInput extends SellOrderNewShoeCreateInput {
  productCondition: object;
  pictures: string[];
}

export interface SellOrderUpdateInput {
  orderId: string;
  productCondition?: {
    boxCondition?: string;
    isTainted?: boolean;
    isTorn?: boolean;
    isInsoleWorn?: boolean;
    isOutsoleWorn?: boolean;
    otherDetail?: string;
  };
  sellPrice?: number;
}

export interface ISellOrderDao {
  /**
   * Create SellOrder for new shoe
   *
   * @param {SellOrderCreateInput} input
   */
  createSellOrderNewShoe(input: SellOrderNewShoeCreateInput): Promise<SellOrder>;

  /**
   * Create SellOrder for used shoe
   *
   * @param {SellOrderUsedShoeCreateInput} input
   */
  createSellOrderUsedShoe(input: SellOrderUsedShoeCreateInput): Promise<SellOrder>;

  /**
   * @description Mark SellOrder as deleted
   *
   * @param {string} sellOrderId
   * @returns {Promise<SellOrder | undefined>} If there is any SellOrder match, mark as
   * deleted and return document. Else return undefined.
   * @throws Error if database operation fails
   */
  deleteById(sellOrderId: string): Promise<SellOrder | undefined>;

  /**
   * @description Delete SellOrder and the associated PriceData from database
   *
   * @param {string | ObjectId} sellOrderId
   * @returns {Promise<SellOrder | undefined>} If there is any SellOrder match, delete it
   * and the associated PriceData document from database and return SellOrder document.
   * Else return undefined.
   * @throws Error if any database operation fails
   */
  destroyById(sellOrderId: string | ObjectId): Promise<SellOrder | undefined>;

  /**
   * @description Update SellOrder status by userId
   *
   * @param {string} sellOrderId
   * @param {string} newStatus
   */
  updateStatusById(
    sellOrderId: ObjectId | string,
    newStatus: string
  ): Promise<SellOrder | undefined>;

  /**
   * @description Find SellOrder by id
   *
   * @param {ObjectId | string} sellOrderId
   */
  findById(sellOrderId: ObjectId | string): Promise<SellOrder | undefined>;

  /**
   * @description Find SellOrder by id and populate all of its references
   *
   * @param {ObjectId | string} sellOrderId
   */
  findByIdAndPopulate(
    sellOrderId: ObjectId | string
  ): Promise<PopulatedSellOrder | undefined>;

  /**
   * @description Find approved lowest price SellOrder by shoeId
   *
   * @param {string} shoeId
   */
  findLowestSellOrderByShoeId(shoeId: string): Promise<SellOrder | undefined>;

  /**
   * @description Find approved lowest price SellOrder by shoeId and shoeSize
   *
   * @param {string} shoeId
   * @param {string} shoeSize
   */
  findLowestSellOrderByShoeIdAndShoeSize(
    shoeId: string,
    shoeSize: string
  ): Promise<SellOrder | undefined>;

  /**
   * @description Find all SellOrder in database
   *
   * @returns {Promise<SellOrder[]>} All SellOrder in database
   * @throws Error if database operation fails
   */
  findAll(): Promise<SellOrder[]>;

  /**
   * @description Find SellOrder by sellerId
   * @param sellerId sellerId
   */
  findBySellerIdAndPopulate(sellerId: string | ObjectId): Promise<SellOrder[]>;
  updateSellOrder(update: SellOrderUpdateInput): Promise<SellOrder | undefined>;
  cancelSellOrder(sellOrderId: string): Promise<SellOrder>;
  findLowestSellPriceSizeMap(shoeId: string): Promise<{ price: number; size: string }[]>;

  /**
   * Populate a SellOrder
   *
   * @param {SellOrder} sellOrder
   */
  populate(sellOrder: SellOrder): Promise<PopulatedSellOrder>;

  /**
   * Populate an array of SellOrders
   *
   * @param {SellOrder[]} sellOrders
   */
  populate(sellOrders: SellOrder[]): Promise<PopulatedSellOrder[]>;

  /**
   * Update SellOrder transactionId field
   *
   * @param {ObjectId} sellOrderId
   * @param {ObjectId} transactionId
   */
  updateTransactionId(
    sellOrderId: ObjectId,
    transactionId: ObjectId
  ): Promise<SellOrder | undefined>;
}
