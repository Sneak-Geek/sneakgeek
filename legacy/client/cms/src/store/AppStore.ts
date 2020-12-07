//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { UserReducers, CatalogReducers } from "../reducers";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory, History } from "history";

export const history: History = createBrowserHistory();

const rootReducers = combineReducers({
  router: connectRouter(history),
  UserState: UserReducers,
  CatalogState: CatalogReducers
});

const composeEnhancers =
  typeof window === "object" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const configureStore = (): any => {
  return createStore(
    rootReducers,
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunkMiddleware))
  );
};

export const AppStore = configureStore();
