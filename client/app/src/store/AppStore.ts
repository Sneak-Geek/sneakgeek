import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Store,
  AnyAction,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
  IUserState,
  IProductState,
  ICatalogState,
  ProductReducers,
  CatalogReducers,
  UserReducers,
  IAppNotificationState,
  IOrderState,
  OrderReducers,
  AppNotificationReducers,
} from 'business';
import {
  NotificationReducers,
  INotificationState,
  LoadingIndicatorReducers,
  ILoadingIndicatorState,
  IEnvironmentState,
  EnvironmentReducers,
} from 'reducers';
import { BaseActions } from 'actions';

export type IAppState = {
  UserState: IUserState;
  ProductState: IProductState;
  AppNotificationState: IAppNotificationState;
  NotificationState: INotificationState;
  LoadingIndicatorState: ILoadingIndicatorState;
  CatalogState: ICatalogState;
  OrderState: IOrderState;
  EnvironmentState: IEnvironmentState;
};

const appReducers = combineReducers({
  UserState: UserReducers,
  ProductState: ProductReducers,
  AppNotificationState: AppNotificationReducers,
  NotificationState: NotificationReducers,
  LoadingIndicatorState: LoadingIndicatorReducers,
  CatalogState: CatalogReducers,
  OrderState: OrderReducers,
  EnvironmentState: EnvironmentReducers,
});

const rootReducers = (state, action) => {
  if (action === BaseActions.RESET) {
    return appReducers(undefined, action);
  }
  return appReducers(state, action);
}

const composeEnhancers =
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const configureStore = (): Store<IAppState, AnyAction> => {
  return createStore(
    rootReducers,
    composeEnhancers(applyMiddleware(thunkMiddleware)),
  );
};

export const AppStore = configureStore();
