// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { applyMiddleware, combineReducers, compose, createStore, Store } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  AccountReducers,
  AppContentReducers,
  DialogReducers,
  ModalReducers,
  NavigationReducers,
  NotificationReducers,
  TransactionReducers
} from "../Reducers";
import { navigationMiddleware } from "../Navigation/AppNavigator";

declare var window: any;

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (): Store<any> => {
  return createStore(
    combineReducers({
      NavigationState: NavigationReducers,
      AccountState: AccountReducers,
      AppContentState: AppContentReducers,
      ModalState: ModalReducers,
      TransactionState: TransactionReducers,
      NotificationState: NotificationReducers,
      DialogState: DialogReducers
    }),
    composeEnhancers(applyMiddleware(navigationMiddleware, thunkMiddleware))
  );
};

const store = configureStore();
export const AppStore = store;
