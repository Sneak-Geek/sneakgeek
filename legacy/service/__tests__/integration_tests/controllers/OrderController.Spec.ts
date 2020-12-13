//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { suite, test } from "@testdeck/jest";
import Server from "../../../src/Server";
import request from "supertest";
import HttpStatus from "http-status";
import { Endpoints, User1, Admin } from "../config";
import { strings as Strings } from "../../../src/assets/strings";
import { isEqual } from "lodash";
import { OrderStatus } from "../../../src/assets/constants";
import { emailLogin } from "./utils";
import { Types } from "../../../src/configuration/inversify/inversify.types";
import { DbClient } from "../../../src/infra/database";
import { ITransactionDao } from "../../../src/infra/dao";
import { NotificationChangeStreamExecutorMock, NotificationServiceMock } from "../mocks";

@suite("/api/v1/order")
export class OrderControllerTest {
  private static adminToken: string;
  private static user1Token: string;

  private sellOrderNewShoeParams = {
    shoeId: "5e810a516f1d6e558b6b1656",
    shoeSize: "8",
    sellPrice: 1000,
  };

  private sellOrderUsedShoeParams = {
    shoeId: "5e810a516f1d6e558b6b1656",
    shoeSize: "10",
    sellPrice: 5000,
    productCondition: {
      boxCondition: Strings.ShoeBoxCondition_FullBox,
      isTainted: true,
      isOutsoleWorn: true,
      isInsoleWorn: true,
      isTorn: true,
      otherDetail: "This is a sell order for used shoe",
    },
    pictures: ["abc.com", "xyz.def"],
  };

  private buyOrderNewShoeParams = {
    shoeId: "5e810a516f1d6e558b6b1656",
    shoeSize: "5",
    buyPrice: 500,
  };

  private buyOrderUsedShoeParams = {
    shoeId: "5e810a516f1d6e558b6b1656",
    shoeSize: "12",
    buyPrice: 1000,
    sellOrderId: "5e810a516f1d6e558b6b1656",
  };

  public static async before() {
    Server.container.snapshot();
    Server.container.unbind(Types.NotificationChangeStreamExecutor);
    Server.container.unbind(Types.NotificationService);

    Server.container
      .bind(Types.NotificationChangeStreamExecutor)
      .to(NotificationChangeStreamExecutorMock)
      .inSingletonScope();
    Server.container.bind(Types.NotificationService).to(NotificationServiceMock);
    try {
      await Server.initAppAsync();
    } catch (error) {
      console.log("Server initialization error", error);
    }

    this.adminToken = (await emailLogin(Admin.Credential)).token;
    this.user1Token = (await emailLogin(User1.Credential)).token;
  }

  public static after() {
    Server.container.restore();
    Server.exit();
  }

  public async after() {
    try {
      const dbClient = Server.container.get<DbClient>(Types.DbClient);
      await Promise.all([
        dbClient.connection.db.dropCollection("buyorders"),
        dbClient.connection.db.dropCollection("sellorders"),
        dbClient.connection.db.dropCollection("transactions"),
      ]);
    } catch (error) { }
  }

  @test("POST /sell-order/new: create sell order for new shoe")
  public async createSellOrderNewShoe() {
    const params = this.sellOrderNewShoeParams;
    const res = await this._createSellOrderNewShoe(params, OrderControllerTest.user1Token);

    const { createdSellOrder } = res.body;
    const pending = OrderStatus.PENDING;
    expect(res.status).toEqual(HttpStatus.CREATED);
    // params should match
    expect(createdSellOrder.sellerId).toEqual(User1.Account.profile);
    expect(createdSellOrder.shoeId).toEqual(params.shoeId);
    expect(createdSellOrder.shoeSize).toEqual(params.shoeSize);
    expect(createdSellOrder.sellPrice).toEqual(params.sellPrice);
    expect(createdSellOrder.isNewShoe).toEqual(true);
    // these properties shouldn't be created when we create SellOrder for new shoe
    expect(createdSellOrder.productCondition).toBeUndefined();
    expect(createdSellOrder.pictures).toEqual([]);
    // default values
    expect(createdSellOrder.status).toEqual(pending);
    expect(createdSellOrder.isDeleted).toEqual(false);
  }

  @test("POST /sell-order/used: create sell order for used shoe")
  public async createSellOrderUsedShoe() {
    const params = this.sellOrderUsedShoeParams;
    const res = await this._createSellOrderUsedShoe(params, OrderControllerTest.user1Token);

    const { createdSellOrder } = res.body;
    const pending = OrderStatus.PENDING;
    delete createdSellOrder.productCondition._id;

    expect(res.status).toEqual(HttpStatus.CREATED);
    // params should match
    expect(createdSellOrder.sellerId).toEqual(User1.Account.profile);
    expect(createdSellOrder.shoeId).toEqual(params.shoeId);
    expect(createdSellOrder.shoeSize).toEqual(params.shoeSize);
    expect(createdSellOrder.sellPrice).toEqual(params.sellPrice);
    expect(isEqual(createdSellOrder.productCondition, params.productCondition)).toEqual(
      true
    );
    expect(isEqual(createdSellOrder.pictures, params.pictures)).toEqual(true);
    expect(createdSellOrder.isNewShoe).toEqual(false);
    // default values
    expect(createdSellOrder.status).toEqual(pending);
    expect(createdSellOrder.isDeleted).toEqual(false);
  }

  @test("POST /buy-order/new: create buy order for new shoe")
  public async createBuyOrderNewShoe() {
    const params = this.buyOrderNewShoeParams;
    const res = await this._createBuyOrderNewShoe(params, OrderControllerTest.user1Token);

    const { createdBuyOrder } = res.body;
    const pending = OrderStatus.PENDING;
    expect(res.status).toEqual(HttpStatus.CREATED);
    // params should match
    expect(createdBuyOrder.buyerId).toEqual(User1.Account.profile);
    expect(createdBuyOrder.shoeId).toEqual(params.shoeId);
    expect(createdBuyOrder.shoeSize).toEqual(params.shoeSize);
    expect(createdBuyOrder.buyPrice).toEqual(params.buyPrice);
    expect(createdBuyOrder.isNewShoe).toEqual(true);
    // default value
    expect(createdBuyOrder.status).toEqual(pending);
    // these fields should not be created for new shoe
    expect(createdBuyOrder.sellOrderId).toBeUndefined();
    expect(createdBuyOrder.transactionId).toBeUndefined();
  }

  @test("POST /buy-order/used: create buy order for used shoe")
  public async createBuyOrderUsedShoe() {
    const params = this.buyOrderUsedShoeParams;
    const res = await this._createBuyOrderUsedShoe(params, OrderControllerTest.user1Token);

    const { createdBuyOrder } = res.body;
    const pending = OrderStatus.PENDING;
    expect(res.status).toEqual(HttpStatus.CREATED);
    // params should match
    expect(createdBuyOrder.buyerId).toEqual(User1.Account.profile);
    expect(createdBuyOrder.shoeId).toEqual(params.shoeId);
    expect(createdBuyOrder.shoeSize).toEqual(params.shoeSize);
    expect(createdBuyOrder.buyPrice).toEqual(params.buyPrice);
    expect(createdBuyOrder.sellOrderId).toEqual(params.sellOrderId);
    expect(createdBuyOrder.isNewShoe).toEqual(false);
    // default value
    expect(createdBuyOrder.status).toEqual(pending);
    // this field should be undefined
    expect(createdBuyOrder.transactionId).toBeUndefined();
  }

  @test("GET /sell-order/all: get all sell order")
  public async getAllSellOrders() {
    await Promise.all([
      this._createSellOrderNewShoe(
        this.sellOrderNewShoeParams,
        OrderControllerTest.user1Token
      ),
      this._createSellOrderUsedShoe(
        this.sellOrderUsedShoeParams,
        OrderControllerTest.adminToken
      ),
    ]);

    const res = await request(Server.instance)
      .get(Endpoints.Order.GetAllSellOrders)
      .set("authorization", OrderControllerTest.adminToken);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body).toHaveLength(2);
  }

  @test("GET /sell-order/all: get all sell order using User permission")
  public async getAllSellOrdersUserPermission() {
    const res = await request(Server.instance)
      .get(Endpoints.Order.GetAllSellOrders)
      .set("authorization", OrderControllerTest.user1Token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("GET /buy-order/all: get all buy order")
  public async getAllBuyOrders() {
    await Promise.all([
      this._createBuyOrderNewShoe(
        this.buyOrderNewShoeParams,
        OrderControllerTest.user1Token
      ),
      this._createBuyOrderUsedShoe(
        this.buyOrderUsedShoeParams,
        OrderControllerTest.adminToken
      ),
    ]);

    const res = await request(Server.instance)
      .get(Endpoints.Order.GetAllBuyOrders)
      .set("authorization", OrderControllerTest.adminToken);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body).toHaveLength(2);
  }

  @test("GET /buy-order/all: get all buy order using User permission")
  public async getAllBuyOrdersUserPermission() {
    const res = await request(Server.instance)
      .get(Endpoints.Order.GetAllBuyOrders)
      .set("authorization", OrderControllerTest.user1Token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("PATCH /sell-order/set-status: set sell order status")
  public async setSellOrderStatus() {
    const sellOrder = (
      await this._createSellOrderNewShoe(
        this.sellOrderNewShoeParams,
        OrderControllerTest.user1Token
      )
    ).body.createdSellOrder;
    const newStatus = OrderStatus.APPROVED;

    const res = await request(Server.instance)
      .patch(Endpoints.Order.SetSellOrderStatus)
      .send({ sellOrder: sellOrder._id, sellOrderStatus: newStatus })
      .set("authorization", OrderControllerTest.adminToken);

    const { updatedSellOrder } = res.body;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(updatedSellOrder.status).toEqual(newStatus);
  }

  @test("PATCH /sell-order/set-status: set sell order status using User permission")
  public async setSellOrderStatusUserPermission() {
    const res = await request(Server.instance)
      .patch(Endpoints.Order.SetSellOrderStatus)
      .send()
      .set("authorization", OrderControllerTest.user1Token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("PATCH /buy-order/set-status: set buy order status")
  public async setBuyOrderStatus() {
    const buyOrder = (
      await this._createBuyOrderNewShoe(
        this.buyOrderNewShoeParams,
        OrderControllerTest.user1Token
      )
    ).body.createdBuyOrder;
    const newStatus = OrderStatus.DENIED;

    const res = await request(Server.instance)
      .patch(Endpoints.Order.SetBuyOrderStatus)
      .send({ buyOrderId: buyOrder._id, buyOrderStatus: newStatus })
      .set("authorization", OrderControllerTest.adminToken);

    const { updatedBuyOrder } = res.body;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(updatedBuyOrder.status).toEqual(newStatus);
  }

  @test("PATCH /buy-order/set-status: set buy order status using User permission")
  public async setBuyOrderStatusUserPermission() {
    const res = await request(Server.instance)
      .patch(Endpoints.Order.SetBuyOrderStatus)
      .send()
      .set("authorization", OrderControllerTest.user1Token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("GET /sell-order/:orderId: find populated sell order by id")
  public async findPopulatedSellOrderById() {
    const sellOrder = (
      await this._createSellOrderNewShoe(
        this.sellOrderNewShoeParams,
        OrderControllerTest.user1Token
      )
    ).body.createdSellOrder;

    const res = await request(Server.instance)
      .get(`${Endpoints.Order.FindSellOrderById}/${sellOrder._id}`)
      .set("authorization", OrderControllerTest.user1Token);

    const sellOrderResult = res.body;
    expect(res.status).toEqual(HttpStatus.OK);
    for (const property in this.sellOrderNewShoeParams) {
      // params should match
      expect(sellOrder[property]).toEqual(res.body[property]);
    }
    // populated fields should be return
    expect(sellOrderResult.seller).not.toBeNull();
    expect(sellOrderResult.shoe).not.toBeNull();
    expect(sellOrderResult.transaction).toBeNull(); // this SellOrder doesn't have transaction
  }

  @test("PUT /sell-order/update: update sell order")
  public async updateSellOrder() {
    const sellOrder = (
      await this._createSellOrderNewShoe(
        this.sellOrderNewShoeParams,
        OrderControllerTest.user1Token
      )
    ).body.createdSellOrder;

    const update = {
      orderId: sellOrder._id,
      productCondition: {
        boxCondition: Strings.ShoeBoxCondition_NoBox,
        isTainted: true,
        isTorn: true,
        isInsoleWorn: true,
        isOutsoleWorn: true,
        otherDetail: "This is a description",
      },
      sellPrice: 1500,
    };
    const res = await request(Server.instance)
      .put(Endpoints.Order.UpdateSellOrder)
      .send(update)
      .set("authorization", OrderControllerTest.user1Token);

    const { updatedSellOrder } = res.body;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(updatedSellOrder.productCondition.boxCondition).toEqual(
      update.productCondition.boxCondition
    );
    expect(updatedSellOrder.productCondition.isTainted).toEqual(
      update.productCondition.isTainted
    );
    expect(updatedSellOrder.productCondition.isTorn).toEqual(
      update.productCondition.isTorn
    );
    expect(updatedSellOrder.productCondition.isInsoleWorn).toEqual(
      update.productCondition.isInsoleWorn
    );
    expect(updatedSellOrder.productCondition.isOutsoleWorn).toEqual(
      update.productCondition.isOutsoleWorn
    );
    expect(updatedSellOrder.productCondition.otherDetail).toEqual(
      update.productCondition.otherDetail
    );
    expect(updatedSellOrder.sellPrice).toEqual(update.sellPrice);
  }

  @test("PATCH /sell-order/cancel: cancel sell order")
  public async cancelSellOrder() {
    const sellOrder = (
      await this._createSellOrderNewShoe(
        this.sellOrderNewShoeParams,
        OrderControllerTest.user1Token
      )
    ).body.createdSellOrder;

    const res = await request(Server.instance)
      .patch(Endpoints.Order.CancelSellOrder)
      .query({ orderId: sellOrder._id })
      .set("authorization", OrderControllerTest.user1Token);

    const canceled = OrderStatus.CANCELED;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.updatedSellOrder.status).toEqual(canceled);
  }

  @test(
    "GET /lowest-sell-order-and-highest-buy-order: get lowest SellOrder and highest BuyOrder"
  )
  public async getSizedShoeOrderInfo() {
    const lowestSellOrderPrice = 10000;
    const higherSellOrderPrice = 50000;
    const highestBuyOrderPrice = 500;
    const lowerBuyOrderPrice = 100;
    const shoeSize = "10";
    await Promise.all([
      this._createApprovedBuyOrderNewShoe(
        {
          ...this.buyOrderNewShoeParams,
          buyPrice: highestBuyOrderPrice,
          shoeSize,
        },
        OrderControllerTest.user1Token
      ),
      this._createApprovedBuyOrderNewShoe(
        {
          ...this.buyOrderNewShoeParams,
          buyPrice: lowerBuyOrderPrice,
          shoeSize,
        },
        OrderControllerTest.user1Token
      ),
      this._createApprovedSellOrderNewShoe(
        {
          ...this.sellOrderNewShoeParams,
          sellPrice: lowestSellOrderPrice,
          shoeSize,
        },
        OrderControllerTest.user1Token
      ),
      this._createApprovedSellOrderNewShoe(
        {
          ...this.sellOrderNewShoeParams,
          sellPrice: higherSellOrderPrice,
          shoeSize,
        },
        OrderControllerTest.user1Token
      ),
    ]);

    const res = await request(Server.instance)
      .get(Endpoints.Order.GetLowestSellOrderAndHighestBuyOrder)
      .query({
        shoeId: this.buyOrderNewShoeParams.shoeId,
        shoeSize,
      })
      .set("authorization", OrderControllerTest.adminToken);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.lowestSellOrder.sellPrice).toEqual(lowestSellOrderPrice);
    expect(res.body.highestBuyOrder.buyPrice).toEqual(highestBuyOrderPrice);
  }

  @test("GET /pay: buy shoe")
  public async buyShoe() {
    const sellOrderId = (
      await this._createSellOrderNewShoe(
        this.sellOrderNewShoeParams,
        OrderControllerTest.user1Token
      )
    ).body.createdSellOrder._id;
    const approved = OrderStatus.APPROVED;
    await request(Server.instance)
      .patch(Endpoints.Order.SetSellOrderStatus)
      .send({ sellOrder: sellOrderId, sellOrderStatus: approved })
      .set("authorization", OrderControllerTest.adminToken);

    const res = await request(Server.instance)
      .get(Endpoints.Order.BuyShoe)
      .query({ paymentType: "intl", sellOrderId })
      .set("authorization", OrderControllerTest.user1Token);

    expect(res.status).toEqual(HttpStatus.OK);

    // 1 transaction should be created
    const transactionDao = Server.container.get<ITransactionDao>(Types.TransactionDao);
    const transactions = await transactionDao.findBySellOrderId(sellOrderId);
    expect(transactions).toHaveLength(1);
    expect(transactions[0].sellOrderId.toHexString()).toEqual(sellOrderId);
    expect(transactions[0].feeBreakdown.productPrice).toEqual(
      this.sellOrderNewShoeParams.sellPrice
    );
    expect(
      transactions[0].feeBreakdown.estimatedShippingFeeFromSellerToSnkg
    ).toBeGreaterThan(0);
    expect(
      transactions[0].feeBreakdown.estimatedShippingFeeFromSnkgToBuyer
    ).toBeGreaterThan(0);
  }

  @test("GET /get-total-fee: get total fee")
  public async getTotalFee() {
    const sellOrderId = (
      await this._createSellOrderNewShoe(
        this.sellOrderNewShoeParams,
        OrderControllerTest.user1Token
      )
    ).body.createdSellOrder._id;

    const res = await request(Server.instance)
      .get(Endpoints.Order.GetTotalFee)
      .query({ sellOrderId })
      .set("authorization", OrderControllerTest.user1Token);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.shippingFee).not.toBeNull();
    expect(res.body.shippingFee).not.toBeUndefined();
    expect(res.body.shoePrice).toEqual(this.sellOrderNewShoeParams.sellPrice);
  }

  @test("GET /shoe-price-size-map: get shoe price-size map for SellOrder")
  public async getShoePriceSizeMapSellOrder() {
    const lowestPriceSizeMap = {
      "6": { sellPrice: 100, shoeSize: "6" },
      "10": { sellPrice: 200, shoeSize: "10" },
    };
    const highPrice = 10000;
    await Promise.all([
      this._createApprovedSellOrderNewShoe(
        { ...this.sellOrderNewShoeParams, ...lowestPriceSizeMap["6"] },
        OrderControllerTest.user1Token
      ),
      this._createApprovedSellOrderNewShoe(
        { ...this.sellOrderNewShoeParams, sellPrice: highPrice, shoeSize: "6" },
        OrderControllerTest.user1Token
      ),
      this._createApprovedSellOrderNewShoe(
        { ...this.sellOrderNewShoeParams, ...lowestPriceSizeMap["10"] },
        OrderControllerTest.user1Token
      ),
      this._createApprovedSellOrderNewShoe(
        {
          ...this.sellOrderNewShoeParams,
          sellPrice: highPrice,
          shoeSize: "10",
        },
        OrderControllerTest.user1Token
      ),
    ]);

    const res = await request(Server.instance)
      .get(Endpoints.Order.GetShoePriceSizeMap)
      .query({
        orderType: "SellOrder",
        shoeId: this.sellOrderNewShoeParams.shoeId,
      })
      .set("authorization", OrderControllerTest.user1Token);

    const priceSizeMapArray = res.body; // priceSizeMapArray type [{ size: string, price: number }]
    expect(res.status).toEqual(HttpStatus.OK);
    expect(priceSizeMapArray.length).toEqual(2);
    for (const priceSizeMap of priceSizeMapArray) {
      expect(lowestPriceSizeMap[priceSizeMap.size].sellPrice).toEqual(priceSizeMap.price);
      expect(lowestPriceSizeMap[priceSizeMap.size].shoeSize).toEqual(priceSizeMap.size);
    }
  }

  @test("GET /shoe-price-size-map: get shoe price-size map for BuyOrder")
  public async getShoePriceSizeMapBuyOrder() {
    const highestPriceSizeMap = {
      "8": { buyPrice: 1000, shoeSize: "8" },
      "12": { buyPrice: 2000, shoeSize: "12" },
    };
    const lowPrice = 100;
    await Promise.all([
      this._createApprovedBuyOrderNewShoe(
        { ...this.buyOrderNewShoeParams, ...highestPriceSizeMap["8"] },
        OrderControllerTest.user1Token
      ),
      this._createApprovedBuyOrderNewShoe(
        { ...this.buyOrderNewShoeParams, buyPrice: lowPrice, shoeSize: "8" },
        OrderControllerTest.user1Token
      ),
      this._createApprovedBuyOrderNewShoe(
        { ...this.buyOrderNewShoeParams, ...highestPriceSizeMap["12"] },
        OrderControllerTest.user1Token
      ),
      this._createApprovedBuyOrderNewShoe(
        { ...this.buyOrderNewShoeParams, buyPrice: lowPrice, shoeSize: "12" },
        OrderControllerTest.user1Token
      ),
    ]);

    const res = await request(Server.instance)
      .get(Endpoints.Order.GetShoePriceSizeMap)
      .query({
        orderType: "BuyOrder",
        shoeId: this.buyOrderNewShoeParams.shoeId,
      })
      .set("authorization", OrderControllerTest.user1Token);

    const priceSizeMapArray = res.body;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(priceSizeMapArray.length).toEqual(2);
    for (const priceSizeMap of priceSizeMapArray) {
      expect(highestPriceSizeMap[priceSizeMap.size].buyPrice).toEqual(priceSizeMap.price);
      expect(highestPriceSizeMap[priceSizeMap.size].shoeSize).toEqual(priceSizeMap.size);
    }
  }

  private async _createSellOrderNewShoe(params: any, token: string) {
    return request(Server.instance)
      .post(Endpoints.Order.CreateSellOrderNewShoe)
      .send(params)
      .set("authorization", token);
  }

  private async _createSellOrderUsedShoe(params: any, token: string) {
    return request(Server.instance)
      .post(Endpoints.Order.CreateSellOrderUsedShoe)
      .send(params)
      .set("authorization", token);
  }

  private async _createBuyOrderNewShoe(params: any, token: string) {
    return request(Server.instance)
      .post(Endpoints.Order.CreateBuyOrderNewShoe)
      .send(params)
      .set("authorization", token);
  }

  private async _createBuyOrderUsedShoe(params: any, token: string) {
    return request(Server.instance)
      .post(Endpoints.Order.CreateBuyOrderUsedShoe)
      .send(params)
      .set("authorization", token);
  }

  private async _createApprovedSellOrderNewShoe(params: any, token: string) {
    const sellOrderId = (await this._createSellOrderNewShoe(params, token)).body
      .createdSellOrder._id;
    const approved = OrderStatus.APPROVED;
    return request(Server.instance)
      .patch(Endpoints.Order.SetSellOrderStatus)
      .send({ sellOrder: sellOrderId, sellOrderStatus: approved })
      .set("authorization", OrderControllerTest.adminToken);
  }

  private async _createApprovedBuyOrderNewShoe(params: any, token: string) {
    const buyOrderId = (await this._createBuyOrderNewShoe(params, token)).body
      .createdBuyOrder._id;
    const approved = OrderStatus.APPROVED;
    const res = await request(Server.instance)
      .patch(Endpoints.Order.SetBuyOrderStatus)
      .send({ buyOrderId, buyOrderStatus: approved })
      .set("authorization", OrderControllerTest.adminToken);
    return res;
  }
}
