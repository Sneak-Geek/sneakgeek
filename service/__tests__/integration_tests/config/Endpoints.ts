//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export const Endpoints = {
  Account: {
    Index: "/api/v1/account",
    EmailLogin: "/api/v1/account/auth/email/login",
    EmailSignup: "/api/v1/account/auth/email/signup",
    FacebookAuth: "/api/v1/account/auth/facebook",
    VerifyAccount: "/api/v1/account/verify",
    SendConfirmationToken: "/api/v1/account/send-confirmation-token",
    VerifyToken: "/api/v1/account/verify-token",
    SetPassword: "/api/v1/account/set-password",
    SetAccessLevel: "/api/v1/account/set-access-level",
    ChangePassword: "/api/v1/account/change-password",
  },
  Profile: {
    Index: "/api/v1/profile",
    UpdateProfileInfo: "/api/v1/profile/update",
    RegisterNotification: "/api/v1/profile/notification/register",
  },
  Order: {
    CreateSellOrderNewShoe: "/api/v1/order/sell-order/new",
    CreateSellOrderUsedShoe: "/api/v1/order/sell-order/used",
    SetSellOrderStatus: "/api/v1/order/sell-order/set-status",
    SetBuyOrderStatus: "/api/v1/order/buy-order/set-status",
    CreateBuyOrderNewShoe: "/api/v1/order/buy-order/new",
    CreateBuyOrderUsedShoe: "/api/v1/order/buy-order/used",
    GetAllSellOrders: "/api/v1/order/sell-order/all",
    GetAllBuyOrders: "/api/v1/order/buy-order/all",
    FindSellOrderById: "/api/v1/order/sell-order",
    UpdateSellOrder: "/api/v1/order/sell-order/update",
    CancelSellOrder: "/api/v1/order/sell-order/cancel",
    GetLowestSellOrderAndHighestBuyOrder:
      "/api/v1/order/lowest-sell-order-and-highest-buy-order",
    BuyShoe: "/api/v1/order/pay",
    GetTotalFee: "/api/v1/order/get-total-fee",
    GetShoePriceSizeMap: "/api/v1/order/shoe-price-size-map",
  },
  Notification: {
    GetByProfileId: "/api/v1/notification",
    MarkNotificationAsRead: "/api/v1/notification/read",
  },
  Transaction: {
    PaymentCallback: "/api/v1/transaction/payment-callback",
  },
};
