const RouteNames = {
  Splash: 'Splash',
  Auth: {
    Name: 'Authentication',
    Login: 'Login',
    EmailSignUp: 'EmailSignUp',
    EmailLogin: 'EmailLogin',
    ForgotPassword: 'ForgotPassword',
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
    AccountTab: {
      Name: 'AccountTab',
      Main: 'AccountTabMain',
      EditProfile: 'AccountTabEditProfile',
      OrderHistory: 'OrderHistory',
      Inventory: 'AccountTabInventory',
      InventoryDetail: 'AccountTabInventoryDetail',
      Faq: 'AccountTabFaq',
      PaymentInfo: 'AccountTabPaymentInfo'
    },
  },
};

export default RouteNames;
