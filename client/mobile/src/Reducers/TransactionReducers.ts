// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action } from "redux-actions";
import {
  updateBuyState,
  updateGetAvailableSellOrders,
  updateGetBuyHistory,
  updateGetSellHistory,
  updateSellState
} from "../Actions";
import {
  AvailableSellOrdersPayload,
  BuyOrderHistoryPayload,
  BuyShoePayload,
  SellOrderHistoryPayload,
  SellShoePayload
} from "../Shared/Payload";
import { NetworkRequestState } from "../Shared/State";
import { handleActionsWithReset } from "../Utilities/ReduxUtilities";

export interface ITransactionState {
  sellShoeState: SellShoePayload;
  buyShoeState: BuyShoePayload;
  buyOrderHistoryState?: BuyOrderHistoryPayload;
  sellOrderHistoryState?: SellOrderHistoryPayload;
  availableSellOrdersState?: AvailableSellOrdersPayload;
}

const initialState: ITransactionState = {
  sellShoeState: {
    isUploadingPictures: false,
    state: NetworkRequestState.NOT_STARTED
  },
  buyShoeState: {
    state: NetworkRequestState.NOT_STARTED
  },
  buyOrderHistoryState: {
    state: NetworkRequestState.NOT_STARTED,
    buyHistory: []
  },
  sellOrderHistoryState: {
    state: NetworkRequestState.NOT_STARTED,
    sellHistory: []
  },
  availableSellOrdersState: {
    state: NetworkRequestState.NOT_STARTED,
    sellOrders: []
  }
};

export const TransactionReducers = handleActionsWithReset<ITransactionState, any>(
  {
    [`${updateBuyState}`]: (state: ITransactionState, action: Action<BuyShoePayload>) => ({
      ...state,
      buyShoeState: { ...state.buyShoeState, ...action.payload }
    }),
    [`${updateSellState}`]: (state: ITransactionState, action: Action<SellShoePayload>) => ({
      ...state,
      sellShoeState: { ...state.sellShoeState, ...action.payload }
    }),
    [`${updateGetBuyHistory}`]: (state: ITransactionState, action: Action<BuyOrderHistoryPayload>) => ({
      ...state,
      buyOrderHistoryState: { ...state.buyOrderHistoryState, ...action.payload }
    }),
    [`${updateGetSellHistory}`]: (state: ITransactionState, action: Action<SellOrderHistoryPayload>) => {
      return {
        ...state,
        sellOrderHistoryState: { ...state.sellOrderHistoryState, ...action.payload }
      };
    },
    [`${updateGetAvailableSellOrders}`]: (state: ITransactionState, action: Action<AvailableSellOrdersPayload>) => {
      return {
        ...state,
        availableSellOrdersState: { ...state, ...action.payload }
      };
    }
  },
  initialState
);
