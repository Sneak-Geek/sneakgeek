//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { suite, test } from "@testdeck/jest";
import Server from "../../../src/Server";
import { Endpoints, Admin, User1 } from "../config";
import HttpStatus from "http-status";
import { Transaction, DbClient, TrackingStatusEnum } from "../../../src/infra/database";
import { emailLogin, sleep } from "./utils";
import request from "supertest";
import { ITransactionDao } from "../../../src/infra/dao";
import { Types } from "../../../src/configuration/inversify";
import { PaymentServiceMock, NotificationChangeStreamExecutorMock } from "../mocks";
import { OrderStatus, PaymentStatus } from "../../../src/assets/constants";
import sinon from "sinon";

@suite("/api/v1/transaction")
export class TransactionControllerTest {
  private static adminToken: string;
  private static userToken: string;
  private static transactionDao: ITransactionDao;
  private static executeOnNotificationInsertStub: sinon.SinonStub;
  private static readonly hashResult = "";

  private readonly sellOrderParams = {
    shoeId: "5e810a516f1d6e558b6b1656",
    shoeSize: "8",
    sellPrice: 1000,
  };

  public static async before() {
    this._setupMock();
    await Server.initAppAsync();
    this.adminToken = (await emailLogin(Admin.Credential)).token;
    this.userToken = (await emailLogin(User1.Credential)).token;
    this.transactionDao = Server.container.get<ITransactionDao>(Types.TransactionDao);
  }

  public static after() {
    sinon.restore();
    Server.container.restore();
    Server.exit();
  }

  public async after() {
    try {
      TransactionControllerTest.executeOnNotificationInsertStub.resetHistory();
      const dbClient = Server.container.get<DbClient>(Types.DbClient);
      await Promise.all([
        dbClient.connection.db.dropCollection("buyorders"),
        dbClient.connection.db.dropCollection("sellorders"),
        dbClient.connection.db.dropCollection("transactions"),
      ]);
    } catch (error) {}
  }

  @test("GET /payment-callback: payment success")
  public async paymentCallbackSuccess() {
    const transaction = await this._createTransaction();
    const callbackQuery = {
      paymentType: "domestic",
      vpc_TxnResponseCode: "0",
      vpc_SecureHash: TransactionControllerTest.hashResult,
      vpc_MerchTxnRef: transaction._id.toHexString(),
      vpc_Amount: "1000",
    };

    const res = await request(Server.instance)
      .get(Endpoints.Transaction.PaymentCallback)
      .query(callbackQuery);

    await sleep(500);

    expect(res.status).toEqual(HttpStatus.OK);
    // transaction should be updated
    const updatedTransaction = await TransactionControllerTest.transactionDao.findById(
      transaction._id
    );
    expect(updatedTransaction.paymentStatus.status).toEqual(PaymentStatus.PROCESSED);
    expect(updatedTransaction.tracking.trackingStatusHistory).toHaveLength(1);
    expect(updatedTransaction.tracking.trackingStatusHistory[0].status).toEqual(
      TrackingStatusEnum.SHIPPING_ORDER_FROM_SELLER_CREATED
    );
    // these values should not be undefined/null/0
    expect(updatedTransaction.tracking.ghnDeliverFromSellerCode).not.toBeFalsy();
    expect(
      updatedTransaction.tracking.ghnDeliverFromSellerExpectedDelivery
    ).not.toBeFalsy();
    expect(
      updatedTransaction.feeBreakdown.actualShippingFeeFromSellerToSnkg
    ).not.toBeFalsy();
    // should send notification to user
    expect(TransactionControllerTest.executeOnNotificationInsertStub.calledOnce).toEqual(
      true
    );
  }

  private static _setupMock() {
    Server.container.snapshot();
    Server.container.unbind(Types.PaymentService);
    Server.container.unbind(Types.NotificationChangeStreamExecutor);
    Server.container.bind(Types.PaymentService).to(PaymentServiceMock).inSingletonScope();
    Server.container
      .bind(Types.NotificationChangeStreamExecutor)
      .to(NotificationChangeStreamExecutorMock)
      .inSingletonScope();

    sinon.stub(PaymentServiceMock.prototype, "generateRedirectUrl").returns("");
    sinon.stub(PaymentServiceMock.prototype, "hashParams").returns(this.hashResult);
    this.executeOnNotificationInsertStub = sinon
      .stub(NotificationChangeStreamExecutorMock.prototype, "executeOnNotificationInsert")
      .resolves();
  }

  // create a transaction by create a sell order and execute buy now
  private async _createTransaction(): Promise<Transaction> {
    const { createdSellOrder } = (
      await request(Server.instance)
        .post(Endpoints.Order.CreateSellOrderNewShoe)
        .send(this.sellOrderParams)
        .set("authorization", TransactionControllerTest.userToken)
    ).body;
    await request(Server.instance)
      .patch(Endpoints.Order.SetSellOrderStatus)
      .send({
        sellOrder: createdSellOrder._id,
        sellOrderStatus: OrderStatus.APPROVED,
      })
      .set("authorization", TransactionControllerTest.adminToken);

    await request(Server.instance)
      .get(Endpoints.Order.BuyShoe)
      .query({ paymentType: "domestic", sellOrderId: createdSellOrder._id })
      .set("authorization", TransactionControllerTest.userToken);

    return (
      await TransactionControllerTest.transactionDao.findBySellOrderId(createdSellOrder._id)
    )[0];
  }
}
