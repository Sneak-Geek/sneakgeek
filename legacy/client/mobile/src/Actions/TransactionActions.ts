// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action, createAction } from "redux-actions";
import { container, Types } from "../Config/Inversify";
import { ICdnService, ITransactionService } from "../Service";
import { NetworkRequestState } from "../Shared/State";
import { getLatestPrice, SellOrder, Transaction } from "../Shared/Model";
import {
  AvailableSellOrdersPayload,
  BuyOrderHistoryPayload,
  BuyShoePayload,
  SellOrderHistoryPayload,
  SellShoePayload
} from "../Shared/Payload";
import { IAppSettingsService, SettingsKeys } from "../Service/AppSettingsService";

export const TransactionActionNames = {
  UPDATE_SELL_ORDER_STATE: "UPDATE_SELL_ORDER_STAGE",
  UPDATE_BUY_STATE: "UPDATE_BUY_STATE",
  UPDATE_GET_SELL_HISTORY: "UPDATE_GET_SELL_HISTORY",
  UPDATE_GET_BUY_HISTORY: "UPDATE_GET_BUY_HISTORY",
  UPDATE_GET_AVAILABLE_SELL_ORDERS: "UPDATE_GET_AVAILABLE_SELL_ORDERS"
};

export const updateSellState = createAction<SellShoePayload>(TransactionActionNames.UPDATE_SELL_ORDER_STATE);
export const updateGetSellHistory = createAction<SellOrderHistoryPayload>(
  TransactionActionNames.UPDATE_GET_SELL_HISTORY
);
export const updateGetBuyHistory = createAction<BuyOrderHistoryPayload>(TransactionActionNames.UPDATE_GET_BUY_HISTORY);
export const updateBuyState = createAction<BuyShoePayload>(TransactionActionNames.UPDATE_BUY_STATE);
export const updateGetAvailableSellOrders = createAction<AvailableSellOrdersPayload>(
  TransactionActionNames.UPDATE_GET_AVAILABLE_SELL_ORDERS
);

export const sellShoes = (sellOrder: Transaction) => {
  return async (dispatch: (param: Action<any>) => void) => {
    dispatch(
      updateSellState({
        state: NetworkRequestState.REQUESTING,
        isUploadingPictures: false
      })
    );
    const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const cdnService = container.get<ICdnService>(Types.ICdnService);
    const transactionService = container.get<ITransactionService>(Types.ITransactionService);

    const pictures = sellOrder.shoePictures;
    const token = appSettings.getValue(SettingsKeys.CurrentAccessToken);

    try {
      if (pictures && pictures.length > 0) {
        dispatch(
          updateSellState({
            state: NetworkRequestState.REQUESTING,
            isUploadingPictures: true
          })
        );
        const presignedUrls = await cdnService.getImageUploadUrls(token, pictures.length);
        const imgUploadPromise = [];

        for (let i = 0; i < pictures.length; i++) {
          imgUploadPromise.push(cdnService.uploadImage(pictures[i], presignedUrls[i], "image/jpeg"));
        }

        await Promise.all(imgUploadPromise);
        dispatch(
          updateSellState({
            state: NetworkRequestState.REQUESTING,
            isUploadingPictures: false
          })
        );
        sellOrder.shoePictures = presignedUrls;
      }

      await transactionService.sellShoe(token, sellOrder);
      dispatch(
        updateSellState({
          state: NetworkRequestState.SUCCESS
        })
      );
    } catch (error) {
      dispatch(
        updateSellState({
          state: NetworkRequestState.FAILED,
          error
        })
      );
    }
  };
};

export const getSellHistory = () => {
  return async (dispatch: (param: Action<any>) => void) => {
    dispatch(updateGetSellHistory({ state: NetworkRequestState.REQUESTING }));
    const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const transactionService = container.get<ITransactionService>(Types.ITransactionService);
    const token = appSettings.getValue(SettingsKeys.CurrentAccessToken);

    try {
      const { sellHistory } = await transactionService.getSellingHistory(token);
      dispatch(updateGetSellHistory({ state: NetworkRequestState.SUCCESS, sellHistory }));
    } catch (error) {
      dispatch(updateGetSellHistory({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const getBuyHistory = () => {
  return async (dispatch: (param: Action<any>) => void) => {
    dispatch(updateGetBuyHistory({ state: NetworkRequestState.REQUESTING }));
    const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const transactionService = container.get<ITransactionService>(Types.ITransactionService);
    const token = appSettings.getValue(SettingsKeys.CurrentAccessToken);

    try {
      const { buyHistory } = await transactionService.getBuyHistory(token);
      dispatch(updateGetBuyHistory({ state: NetworkRequestState.SUCCESS, buyHistory }));
    } catch (error) {
      dispatch(updateGetBuyHistory({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const buyShoe = (sellOrder: SellOrder) => {
  return async (dispatch: (param: Action<any>) => void) => {
    dispatch(updateBuyState({ state: NetworkRequestState.REQUESTING }));
    const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const transactionService = container.get<ITransactionService>(Types.ITransactionService);
    const token = appSettings.getValue(SettingsKeys.CurrentAccessToken);

    try {
      await transactionService.buyShoe(token, getLatestPrice(sellOrder), sellOrder._id);
      dispatch(updateBuyState({ state: NetworkRequestState.SUCCESS }));
    } catch (error) {
      dispatch(updateBuyState({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const getAvailableSellOrders = (shoeId: string) => {
  return async (dispatch: (param: Action<any>) => void) => {
    dispatch(updateGetAvailableSellOrders({ state: NetworkRequestState.REQUESTING }));

    const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const transactionService = container.get<ITransactionService>(Types.ITransactionService);
    const token = appSettings.getValue(SettingsKeys.CurrentAccessToken);

    try {
      const sellOrders = await transactionService.getAvailableOrders(token, shoeId);
      dispatch(updateGetAvailableSellOrders({ state: NetworkRequestState.SUCCESS, sellOrders }));
    } catch (error) {
      dispatch(updateGetAvailableSellOrders({ state: NetworkRequestState.FAILED, error }));
    }
  };
};
