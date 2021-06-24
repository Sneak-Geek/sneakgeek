//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export const Types = {
  // Database client
  DbClient: Symbol("DbClient"),

  // Repository
  AccountRepository: Symbol("AccountRepository"),
  ProfileRepository: Symbol("ProfileRepository"),
  ShoeRepository: Symbol("ShoeRepository"),
  VerificationRepository: Symbol("VerificationRepository"),
  ArticleRepository: Symbol("ArticleRepository"),
  TransactionRepository: Symbol("TransactionRepository"),
  OrderRepository: Symbol("OrderRepository"),
  InventoryRepository: Symbol("InventoryRepository"),
  ProductRequestRepository: Symbol("ProductRequestRepository"),
  SupportTicketRepository: Symbol("SupportTicketRepository"),
  ReviewRepository: Symbol("ReviewRepository"),
  CatalogueRepository: Symbol("CatalogueRepository"),
  NotificationRepository: Symbol("NotificationRepository"),
  BalanceHistoryRepository: Symbol("BalanceHistoryRepository"),

  // Service
  EmailService: Symbol("EmailService"),
  CdnService: Symbol("CdnService"),
  JwtService: Symbol("JwtService"),
  ShippingService: Symbol("ShippingService"),
  PaymentService: Symbol("PaymentService"),
  NotificationService: Symbol("NotificationService"),
  AppleAuthService: Symbol("AppleAuthService"),
  SearchService: Symbol("SearchService"),

  // Provider
  BootstrapProvider: Symbol("BootstrapProvider"),
  MigrationProvider: Symbol("MigrationProvider"),

  // Dao
  ProfileDao: Symbol("ProfileDao"),
  OrderDao: Symbol("OrderDao"),
  InventoryDao: Symbol("InventoryDao"),
  TransactionDao: Symbol("TransactionDao"),
  ReviewDao: Symbol("ReviewDao"),
  AccountDao: Symbol("AccountDao"),
  NotificationDao: Symbol("NotificationDao"),
  BalanceHistoryDao: Symbol("BalanceHistoryDao"),
  ShoeDao: Symbol("ShoeDao"),

  // Middlewares
  AzCdnMulterMiddlware: Symbol("AzCdnMulterMiddleware"),
  IsSellerMiddleware: Symbol("IsSellerMiddleware"),

  // Executor
  NotificationChangeStreamExecutor: Symbol("NotificationChangeStreamExecutor"),
};
