import thunkMiddleware from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Store,
  AnyAction,
} from 'redux';
import { UserReducers, CatalogReducers } from 'business';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { IUserState, ICatalogState } from 'business';

export const history: History = createBrowserHistory();

export interface IAppState {
  router: {
    location: Location;
    action: any;
  };
  UserState: IUserState;
  CatalogState: ICatalogState;
}

const rootReducers = combineReducers({
  router: connectRouter(history),
  UserState: UserReducers,
  CatalogState: CatalogReducers,
});

const composeEnhancers =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const configureStore = (): Store<IAppState, AnyAction> => {
  return createStore(
    rootReducers,
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunkMiddleware)),
  );
};

export const AppStore = configureStore();
