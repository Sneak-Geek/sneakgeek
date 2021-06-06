// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { TabHomeMainScreenContainer } from "./Tab.Home.Main/TabHomeMainScreen.Container";

import { TabSearchContainer } from "./Tab.Search/TabSearch.Container";
import { TabBuyMainScreenContainer } from "./Tab.Buy.Main/TabBuyMainScreen.Container";

import { TabUserMainScreenContainer as TabUserMain } from "./Tab.User.Main/TabUserMainScreen.Container";
import { TabUserEditScreenContainer as TabUserEdit } from "./Tab.User.Edit/TabUserEditScreen.Container";
import { TabUserSearchScreenContainer as TabUserSearch } from "./Tab.User.Search/TabUserSearchScreen.Container";

import { TransactionBuyTabScreenContainer as TabTransactionBuy } from "./Tab.Transaction.Buy/TransactionBuyTabScreen.Container";
import { TransactionHistoryScreenContainer as TabTransactionHistory } from "./Tab.Transaction.History/TransactionHistoryScreen.Container";
import { TransactionSellTabContainer as TabTransactionSell } from "./Tab.Transaction.Sell/TransactionSellTab.Container";

const Tabs = {
  Home: {
    Main: TabHomeMainScreenContainer
  },
  Buy: {
    Main: TabBuyMainScreenContainer
  },
  Search: {
    Main: TabSearchContainer
  },
  User: {
    Main: TabUserMain,
    Edit: TabUserEdit,
    Search: TabUserSearch
  },
  Transaction: {
    Buy: TabTransactionBuy,
    History: TabTransactionHistory,
    Sell: TabTransactionSell
  }
};

export default Tabs;
