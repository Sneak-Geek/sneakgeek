//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

// import { MongoMemoryReplSet } from "mongodb-memory-server";
// import request from "supertest";
// import * as faker from "faker";
// import HttpStatus from "http-status";
// import Server from "../../src/Server";
// import { BuyOrderDao } from "../../src/infra/dao";
// import { Types } from "../../src/configuration/inversify";
// import { Repository, PriceData, BuyOrder } from "../../src/infra/database";
// import { BootstrapProvider } from "../../src/infra/providers";
// import sinon from "sinon";
// import mongoose from "mongoose";

// describe("BuyOrderDao unit test", () => {
//   let mongodbReplicaSet: MongoMemoryReplSet;
//   let buyOrderDao: BuyOrderDao;
//   let buyOrderRepo: Repository<BuyOrder>;
//   let priceDataRepo: Repository<PriceData>;

//   jest.setTimeout(30000);

//   beforeAll(async () => {
//     sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
//     sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);

//     mongodbReplicaSet = new MongoMemoryReplSet({
//       instanceOpts: [{ port: 27017 }],
//       replSet: { storageEngine: "wiredTiger" }
//     });
//     await mongodbReplicaSet.waitUntilRunning();

//     await Server.initAppAsync();

//     buyOrderDao = Server.container.get<BuyOrderDao>(Types.BuyOrderDao);
//     //
//     buyOrderRepo = Server.container.get<Repository<BuyOrder>>(Types.BuyOrderRepository);
//     priceDataRepo = Server.container.get<Repository<PriceData>>(Types.PriceDataRepository);
//   });

//   afterAll(async () => {
//     Server.exit();
//     await mongodbReplicaSet.stop();
//   });

//   describe("create", () => {
//     const createBuyOrderInput = {
//       shoe: new mongoose.Types.ObjectId(),
//       buyerId: new mongoose.Types.ObjectId(),
//       buyPrice: 1000,
//       shoeId: new mongoose.Types.ObjectId(),
//       shoeSize: "8"
//     };

//     describe("create BuyOrder success", () => {
//       let createdBuyOrder: BuyOrder;
//       let createdPriceData: PriceData;

//       beforeAll(async () => {
//         createdBuyOrder = await buyOrderDao.create(createBuyOrderInput);
//       });

//       afterAll(() => {
//         Server.dropDatabase();
//       });

//       it("should create BuyOrder appropriately", () => {
//         expect(createdBuyOrder.buyer).toEqual(createBuyOrderInput.buyerId);
//         expect(createdBuyOrder.shoe).toEqual(createBuyOrderInput.shoeId);
//         expect(createdBuyOrder.shoeSize).toEqual(createdBuyOrder.shoeSize);
//       });

//       it("should create PriceData appropriately", async () => {
//         createdPriceData = await priceDataRepo.findById(createdBuyOrder.buyPrice).exec();
//         expect(createdPriceData.price).toEqual(createBuyOrderInput.buyPrice);
//       });
//     });

//     describe("create BuyOrder fail", () => {
//       beforeAll(async () => {
//         sinon.stub(buyOrderRepo, "create").throws();

//         try {
//           await buyOrderDao.create(createBuyOrderInput);
//         } catch (error) { }
//       });

//       afterAll(() => {
//         sinon.restore();
//       });

//       it("should not create BuyOrder", async () => {
//         expect(await buyOrderRepo.countDocuments().exec()).toEqual(0);
//       });

//       it("should not create PriceData", async () => {
//         expect(await priceDataRepo.countDocuments().exec()).toEqual(0);
//       });
//     });

//     describe("create PriceData fail", () => {
//       beforeAll(async () => {
//         sinon.stub(priceDataRepo, "create").throws();

//         try {
//           await buyOrderDao.create(createBuyOrderInput);
//         } catch (error) { }
//       });

//       afterAll(() => {
//         sinon.restore();
//       });

//       it("should rollback created BuyOrder", async () => {
//         expect(await buyOrderRepo.countDocuments().exec()).toEqual(0);
//       });

//       it("should not create PriceData", async () => {
//         expect(await priceDataRepo.countDocuments().exec()).toEqual(0);
//       });
//     });
//   });
// });
