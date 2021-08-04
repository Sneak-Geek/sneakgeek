//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { AsyncContainerModule, Container } from "inversify";
import { Types } from "./inversify.types";
import {
  IEmailService,
  EmailService,
  ICdnService,
  AzBlobCdnService,
  IJwtService,
  JwtService,
  IShippingService,
  ShippingService,
  IPaymentService,
  PaymentService,
  INotificationService,
  EmptyNotificationService,
  IAppleAuthService,
  AppleAuthService,
  SearchService,
  ISearchService,
} from "../../infra/services";
import {
  IBootstrapProvider,
  BootstrapProvider,
  EnvironmentProvider,
} from "../../infra/providers";
import {
  UserAccountRepository,
  UserAccount,
  UserProfile,
  UserProfileRepository,
  VerificationRepository,
  Verification,
  ArticleRepository,
  Article,
  Shoe,
  ShoeRepository,
  CatalogueRepository,
  Catalogue,
  ProductRequest,
  ProductRequestRepository,
  SupportTicket,
  SupportTicketRepository,
  Review,
  ReviewRepository,
  Order,
  OrderRepository,
  Inventory,
  InventoryRepository,
  Transaction,
  TransactionRepository,
  Notification,
  NotificationRepository,
  getDbClient,
  DbClient,
  Repository,
  BalanceHistoryRepository,
  BalanceHistory,
} from "../../infra/database";
import {
  IOrderDao,
  OrderDao,
  IInventoryDao,
  InventoryDao,
  ITransactionDao,
  TransactionDao,
  IReviewDao,
  ReviewDao,
  IProfileDao,
  ProfileDao,
  IAccountDao,
  AccountDao,
  INotificationDao,
  NotificationDao,
  IShoeDao,
  ShoeDao,
  IBalanceHistoryDao,
  BalanceHistoryDao,
} from "../../infra/dao";
import { AzCdnMulterMiddlware, IsSellerMiddleware } from "../../infra/middlewares";
import {
  INotificationChangeStreamExecutor,
  NotificationChangeStreamExecutor,
} from "../../infra/executor";

// import @controller meta-data tag
import "../../infra/controllers/AccountController";
import "../../infra/controllers/ProfileController";
import "../../infra/controllers/ShoeController";
import "../../infra/controllers/ArticleController";
import "../../infra/controllers/SettingsController";
import "../../infra/controllers/ProductRequestController";
import "../../infra/controllers/SupportTicketController";
import "../../infra/controllers/ReviewController";
import "../../infra/controllers/CatalogueController";
import "../../infra/controllers/OrderController";
import "../../infra/controllers/TransactionController";
import "../../infra/controllers/ImageController";
import "../../infra/controllers/NotificationController";
import "../../infra/controllers/BalanceHistoryController";
import "../../infra/controllers/InventoryController";
import "../../infra/admin_controllers/AdminOrderControllers";
import "../../infra/controllers/HealthController";
import "../../infra/controllers/WarmupController";
import {
  Migration_1624492681744,
  Migration_07232021,
  Migration_07272021,
} from "../../infra/migrations";
import { MigrationProvider } from "../../infra/providers/MigrationProvider/MigrationProvider";
import { IFirebaseAuthService } from "../../infra/services/FirebaseAuthService/IFirebaseAuthService";
import { FirebaseAuthService } from "../../infra/services/FirebaseAuthService/FirebaseAuthService";

// Creating new container
const container = new Container();

// Service
container.bind<IEmailService>(Types.EmailService).to(EmailService);
container.bind<ICdnService>(Types.CdnService).to(AzBlobCdnService);
container.bind<IJwtService>(Types.JwtService).to(JwtService);
container
  .bind<IAppleAuthService>(Types.AppleAuthService)
  .to(AppleAuthService)
  .inSingletonScope();
container.bind<IFirebaseAuthService>(Types.FirebaseAuthService).to(FirebaseAuthService);

// Middlewares
container.bind(Types.AzCdnMulterMiddlware).to(AzCdnMulterMiddlware);
container.bind(Types.IsSellerMiddleware).to(IsSellerMiddleware);

container
  .bind<IShippingService>(Types.ShippingService)
  .to(ShippingService)
  .inSingletonScope();
container.bind<IPaymentService>(Types.PaymentService).to(PaymentService);

container
  .bind<INotificationService>(Types.NotificationService)
  .to(EmptyNotificationService)
  .inSingletonScope();

// Providers
container
  .bind<IBootstrapProvider>(Types.BootstrapProvider)
  .to(BootstrapProvider)
  .inSingletonScope();
container.bind<ISearchService>(Types.SearchService).to(SearchService);
container
  .bind<MigrationProvider>(Types.MigrationProvider)
  .to(MigrationProvider)
  .inSingletonScope();

// Executor
container
  .bind<INotificationChangeStreamExecutor>(Types.NotificationChangeStreamExecutor)
  .to(NotificationChangeStreamExecutor)
  .inSingletonScope();

// Repositories
container
  .bind<Repository<UserAccount>>(Types.AccountRepository)
  .toConstantValue(UserAccountRepository);

container
  .bind<Repository<UserProfile>>(Types.ProfileRepository)
  .toConstantValue(UserProfileRepository);

container
  .bind<Repository<Verification>>(Types.VerificationRepository)
  .toConstantValue(VerificationRepository);

container.bind<Repository<Shoe>>(Types.ShoeRepository).toConstantValue(ShoeRepository);

container
  .bind<Repository<Article>>(Types.ArticleRepository)
  .toConstantValue(ArticleRepository);

container
  .bind<Repository<ProductRequest>>(Types.ProductRequestRepository)
  .toConstantValue(ProductRequestRepository);

container
  .bind<Repository<SupportTicket>>(Types.SupportTicketRepository)
  .toConstantValue(SupportTicketRepository);

container
  .bind<Repository<Review>>(Types.ReviewRepository)
  .toConstantValue(ReviewRepository);

container
  .bind<Repository<Catalogue>>(Types.CatalogueRepository)
  .toConstantValue(CatalogueRepository);

container.bind<Repository<Order>>(Types.OrderRepository).toConstantValue(OrderRepository);

container
  .bind<Repository<Inventory>>(Types.InventoryRepository)
  .toConstantValue(InventoryRepository);

container
  .bind<Repository<Transaction>>(Types.TransactionRepository)
  .toConstantValue(TransactionRepository);

container
  .bind<Repository<Notification>>(Types.NotificationRepository)
  .toConstantValue(NotificationRepository);

container
  .bind<Repository<BalanceHistory>>(Types.BalanceHistoryRepository)
  .toConstantValue(BalanceHistoryRepository);

// Data Access Objects (DAO)
container.bind<IReviewDao>(Types.ReviewDao).to(ReviewDao);
container.bind<IOrderDao>(Types.OrderDao).to(OrderDao);
container.bind<IInventoryDao>(Types.InventoryDao).to(InventoryDao);
container.bind<ITransactionDao>(Types.TransactionDao).to(TransactionDao);
container.bind<IProfileDao>(Types.ProfileDao).to(ProfileDao);
container.bind<IAccountDao>(Types.AccountDao).to(AccountDao);
container.bind<INotificationDao>(Types.NotificationDao).to(NotificationDao);
container.bind<IBalanceHistoryDao>(Types.BalanceHistoryDao).to(BalanceHistoryDao);
container.bind<IShoeDao>(Types.ShoeDao).to(ShoeDao);

// Migration
container
  .bind<Migration_1624492681744>(Migration_1624492681744.name)
  .to(Migration_1624492681744);
container.bind<Migration_07232021>(Migration_07232021.name).to(Migration_07232021);
container.bind<Migration_07272021>(Migration_07272021.name).to(Migration_07272021);

// Asynchronous bindings
const asyncBindings = new AsyncContainerModule(async (bind) => {
  // Db connection
  const dbClient = await getDbClient(EnvironmentProvider.env.MongoUrl);
  bind<DbClient>(Types.DbClient).toConstantValue(dbClient);
});

export { container, asyncBindings };
