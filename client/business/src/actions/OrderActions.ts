import { createAction } from "redux-actions"
import { Shoe, PopulatedSellOrder } from "../model"
import { GetBuyOrdersPayload, GetSellOrderHistoryPayload, NetworkRequestState } from "../payload";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { ISettingsProvider, IOrderService, SettingsKey, OrderType } from "../loader";

export const OrderActions = {
  BUY_SHOE: "BUY_SHOE",
  UPDATE_GET_BUY_ORDERS_STATE: "UPDATE_GET_BUY_ORDERS_STATE",
  UPDATE_GET_SELL_ORDER_HISTORY_STATE: "UPDATE_GET_SELL_ORDER_HISTORY_STATE"
}

export const buyShoe = createAction<{
  shoe?: Shoe, size?: string;
}>(OrderActions.BUY_SHOE);

export const updateGetBuyOrdersState = createAction<GetBuyOrdersPayload>(OrderActions.UPDATE_GET_BUY_ORDERS_STATE);
export const updateGetSellOrderHistoryState = createAction<GetSellOrderHistoryPayload>(OrderActions.UPDATE_GET_SELL_ORDER_HISTORY_STATE);

export const getUserPopulatedOrders = (type: OrderType) => {
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(FactoryKeys.ISettingsProvider);
  const orderService = ObjectFactory.getObjectInstance<IOrderService>(FactoryKeys.IOrderService);
  const updateAction = type === "BuyOrder" ? updateGetBuyOrdersState : updateGetSellOrderHistoryState;

  return async (dispatch: Function) => {
    dispatch(updateAction({ state: NetworkRequestState.REQUESTING }));
    try {
      const orders = await orderService.getUserPopulatedOrders(settings.getValue(SettingsKey.CurrentAccessToken), type);
      dispatch(updateAction({
        state: NetworkRequestState.SUCCESS,
        // @ts-ignore
        data: orders as [] | PopulatedSellOrder[]
      }));
    } catch (error) {
      dispatch(updateAction({
        state: NetworkRequestState.FAILED,
        error
      }));
    }
  }
}