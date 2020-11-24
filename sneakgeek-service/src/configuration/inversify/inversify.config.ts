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
  NotificationService,
  IAppleAuthService,
  AppleAuthService,
} from "../../infra/services";
import {
  IBootstrapProvider,
  BootstrapProvider,
  ISearchProvider,
  SearchProvider,
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
  SellOrder,
  SellOrderRepository,
  BuyOrder,
  BuyOrderRepository,
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
  ISellOrderDao,
  SellOrderDao,
  IBuyOrderDao,
  BuyOrderDao,
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
import { AzCdnMulterMiddlware } from "../../infra/middlewares";
import {
  INotificationChangeStreamExecutor,
  NotificationChangeStreamExecutor,
} from "../../infra/executor";
import { EnvironmentProvider } from "../../infra/providers";

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

// Middlewares
container.bind(Types.AzCdnMulterMiddlware).to(AzCdnMulterMiddlware);

container
  .bind<IShippingService>(Types.ShippingService)
  .to(ShippingService)
  .inSingletonScope();
container.bind<IPaymentService>(Types.PaymentService).to(PaymentService);

container
  .bind<INotificationService>(Types.NotificationService)
  .to(NotificationService)
  .inSingletonScope();

// Providers
container
  .bind<IBootstrapProvider>(Types.BootstrapProvider)
  .to(BootstrapProvider)
  .inSingletonScope();
container.bind<ISearchProvider>(Types.SearchProvider).to(SearchProvider);

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

container
  .bind<Repository<SellOrder>>(Types.SellOrderRepository)
  .toConstantValue(SellOrderRepository);

container
  .bind<Repository<BuyOrder>>(Types.BuyOrderRepository)
  .toConstantValue(BuyOrderRepository);

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
container.bind<ISellOrderDao>(Types.SellOrderDao).to(SellOrderDao);
container.bind<IBuyOrderDao>(Types.BuyOrderDao).to(BuyOrderDao);
container.bind<ITransactionDao>(Types.TransactionDao).to(TransactionDao);
container.bind<IProfileDao>(Types.ProfileDao).to(ProfileDao);
container.bind<IAccountDao>(Types.AccountDao).to(AccountDao);
container.bind<INotificationDao>(Types.NotificationDao).to(NotificationDao);
container.bind<IBalanceHistoryDao>(Types.BalanceHistoryDao).to(BalanceHistoryDao);
container.bind<IShoeDao>(Types.ShoeDao).to(ShoeDao);

// Asynchronous bindings
const asyncBindings = new AsyncContainerModule(async (bind) => {
  // Db connection
  const dbClient = await getDbClient(EnvironmentProvider.env.MongoUrl);
  bind<DbClient>(Types.DbClient).toConstantValue(dbClient);
});

export { container, asyncBindings };
