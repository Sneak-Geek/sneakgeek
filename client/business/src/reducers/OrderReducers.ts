import { Shoe, BuyOrder, PopulatedSellOrder } from "../model";
import { Action } from "redux-actions";
import { buyShoe, updateGetSellOrderHistoryState, updateGetBuyOrdersState } from "../actions";
import { NetworkRequestState, GetSellOrderHistoryPayload, GetBuyOrdersPayload } from "../payload";
import { handleActionsWithReset } from "../utilities/ReduxUtilities";

export type IOrderState = {
  sellState: {
    shoe?: Shoe;
  };
  buyState: {
    shoe?: Shoe;
    size?: string;
  };
  buyOrdersState: {
    state: NetworkRequestState;
    orders: BuyOrder[];
    error?: any;
  };
  sellOrderHistoryState: {
    state: NetworkRequestState;
    orders: PopulatedSellOrder[];
    error?: any;
  };
};

export const initialState: IOrderState = {
  buyState: {},
  sellState: {},
  buyOrdersState: {
    state: NetworkRequestState.NOT_STARTED,
    orders: [],
  },
  sellOrderHistoryState: {
    state: NetworkRequestState.NOT_STARTED,
    orders: [],
  },
};

export const OrderReducers = handleActionsWithReset<IOrderState, any>(
  {
    [`${buyShoe}`]: (
      state: IOrderState,
      action: Action<{ shoe?: Shoe; size?: string }>
    ) => ({
      ...state,
      buyState: {
        ...state.buyState,
        shoe: action.payload.shoe || state.buyState.shoe,
        size: action.payload.size || state.buyState.size,
      },
    }),
    [`${updateGetSellOrderHistoryState}`]: (
      state: IOrderState,
      action: Action<GetSellOrderHistoryPayload>
    ) => ({
      ...state,
      sellOrderHistoryState: {
        ...state.sellOrderHistoryState,
        state: action.payload.state,
        error: action.payload.error,
        orders: action.payload.data ?? state.sellOrderHistoryState.orders,
      },
    }),
    [`${updateGetBuyOrdersState}`]: (
      state: IOrderState,
      action: Action<GetBuyOrdersPayload>
    ) => ({
      ...state,
      buyOrdersState: {
        ...state.buyOrdersState,
        state: action.payload.state,
        error: action.payload.error,
        orders: action.payload.data ?? state.buyOrdersState.orders,
      },
    }),
  },
  initialState
);
