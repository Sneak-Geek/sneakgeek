const RouteNames = {
  Splash: 'Splash',
  Auth: {
    Name: 'Authentication',
    Login: 'Login',
    EmailSignUp: 'EmailSignUp',
    EmailLogin: 'EmailLogin',
    ForgotPassword: 'ForgotPassword',
    ForgotPasswordEmailSent: 'ForgotPasswordEmailSent'
  },
  Product: {
    Name: 'Product',
    ProductDetail: 'ProductDetail',
    NewReview: 'ProductNewReview',
    AllReviews: 'ProductAllReviews',
  },
  Order: {
    Name: 'Order',
    NewSellOrder: 'NewSellOrder',
    NewBuyOrder: 'NewBuyOrder',
    SizeSelection: 'OrderSizeSelection',
    BuyConfirmation: 'OrderBuyConfirmation',
    Payment: 'OrderPayment',
  },
  Tab: {
    Name: 'Tabs',
    HomeTab: {
      Name: 'HomeTab',
      Main: 'HomeTabMain',
      SeeMore: 'HomeTabSeeMore',
      Notification: 'HomeTabNotification',
    },
    SearchTab: {
      Name: 'SearchTab',
      Main: 'SearchTabMain',
      ProductRequest: 'ProductRequest',
    },
    TransactionTab: {
      Name: 'TransactionTab',
      Main: 'TransactionTabMain',
      Buy: 'TransactionBuyOrder',
      SellOrderHistory: 'SellOrderHistory',
      Detail: 'OrderDetail',
    },
    InventoryTab: {
      Name: 'InventoryTab',
      Inventory: 'Inventory',
      InventoryDetail: 'InventoryDetail',
    },
    AccountTab: {
      Name: 'AccountTab',
      Main: 'AccountTabMain',
      EditProfile: 'AccountTabEditProfile',
      ViewProfile: 'AccountTabViewProfile',
      OrderHistory: 'OrderHistory',
      Faq: 'AccountTabFaq',
      PaymentInfo: 'AccountTabPaymentInfo',
      ContactUs: 'AccountTabContactUs',
    },
  },
};

export default RouteNames;
