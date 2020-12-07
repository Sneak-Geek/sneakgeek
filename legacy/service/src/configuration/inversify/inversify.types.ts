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
  SellOrderRepository: Symbol("SellOrderRepository"),
  BuyOrderRepository: Symbol("BuyOrderRepository"),
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

  // Provider
  BootstrapProvider: Symbol("BootstrapProvider"),
  SearchService: Symbol("SearchService"),

  // Dao
  ProfileDao: Symbol("ProfileDao"),
  SellOrderDao: Symbol("SellOrderDao"),
  BuyOrderDao: Symbol("BuyOrderDao"),
  TransactionDao: Symbol("TransactionDao"),
  ReviewDao: Symbol("ReviewDao"),
  AccountDao: Symbol("AccountDao"),
  NotificationDao: Symbol("NotificationDao"),
  BalanceHistoryDao: Symbol("BalanceHistoryDao"),
  ShoeDao: Symbol("ShoeDao"),

  // Middlewares
  AzCdnMulterMiddlware: Symbol("AzCdnMulterMiddleware"),

  // Executor
  NotificationChangeStreamExecutor: Symbol("NotificationChangeStreamExecutor"),
};
