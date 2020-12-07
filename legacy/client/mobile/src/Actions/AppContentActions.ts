//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { createAction } from "redux-actions";
import { Shoe } from "../Shared/Model";
import { IAppContentService } from "../Service";
import { NetworkRequestState } from "../Shared/State";
import { SearchShoePayload, GetShoesPayload, RequestProductPayload } from "../Shared/Payload";
import { container, Types } from "../Config/Inversify";
import { showNotification } from "./NotificationActions";
import { IAppSettingsService, SettingsKeys } from "../Service/AppSettingsService";
namespace AppContentActionNames {
  export const FETCH_SHOES = "FETCH_SHOES";
  export const UPDATE_FETCH_SHOES_ERROR = "UPDATE_FETCH_SHOES_ERROR";
  export const UPDATE_SHOES_DATA = "UPDATE_SHOES_DATA";

  export const UPDATE_SEARCH_SHOE_STATE = "UPDATE_SEARCH_SHOE_STATE";
  export const UPDATE_GET_SHOES_STATE = "UPDATE_GET_SHOE_STATE";
  export const UPDATE_REQUEST_PRODUCT_STATE = "UPDATE_REQUEST_PRODUCT_STATE";
}

export const updateStatusFetchShoes = createAction<boolean>(AppContentActionNames.FETCH_SHOES);
export const updateShoesData = createAction<Shoe[]>(AppContentActionNames.UPDATE_SHOES_DATA);
export const updateFetchShoesError = createAction<any>(AppContentActionNames.UPDATE_FETCH_SHOES_ERROR);

export const updateSearchShoesState = createAction<SearchShoePayload>(AppContentActionNames.UPDATE_SEARCH_SHOE_STATE);

export const updateGetShoesState = createAction<GetShoesPayload>(AppContentActionNames.UPDATE_GET_SHOES_STATE);

export const updateStateRequestProduct = createAction<RequestProductPayload>(
  AppContentActionNames.UPDATE_REQUEST_PRODUCT_STATE
);

export const requestProduct = (
  title: string,
  brand: string
  // gender: string, colorways: string[], productLink: string, imageUrls: string[]
) => {
  return async (dispatch: Function) => {
    dispatch(
      updateStateRequestProduct({
        state: NetworkRequestState.REQUESTING,
        error: null
      })
    );
    try {
      const appContentService = container.get<IAppContentService>(Types.IAppContentService);
      await appContentService.requestProduct(
        title,
        brand
        //  gender, colorways, productLink, imageUrls
      );
      dispatch(updateStateRequestProduct({ state: NetworkRequestState.SUCCESS }));
      // dispatch(navigateRequireSuccess())
    } catch (error) {
      dispatch(updateStateRequestProduct({ state: NetworkRequestState.FAILED, error }));
      dispatch(showNotification(error));
    }
  };
};

export const fetchShoes = () => {
  return async (dispatch: Function) => {
    dispatch(updateFetchShoesError(null));
    dispatch(updateStatusFetchShoes(true));
    try {
      const appContentService = container.get<IAppContentService>(Types.IAppContentService);
      const shoes = await appContentService.getShoes();
      dispatch(updateShoesData(shoes));
    } catch (error) {
    } finally {
      dispatch(updateStatusFetchShoes(false));
    }
  };
};

export const searchShoes = (keyword: string) => {
  return async (dispatch: Function) => {
    dispatch(updateSearchShoesState({ state: NetworkRequestState.REQUESTING, error: undefined }));
    try {
      const appContentService = container.get<IAppContentService>(Types.IAppContentService);
      const shoes = await appContentService.searchShoes(keyword);
      dispatch(
        updateSearchShoesState({
          state: NetworkRequestState.SUCCESS,
          shoes,
          error: undefined
        })
      );
    } catch (error) {
      dispatch(updateSearchShoesState({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const getShoesByIds = (ids: string[]) => {
  return async (dispatch: Function) => {
    try {
      dispatch(updateGetShoesState({ state: NetworkRequestState.NOT_STARTED, error: undefined }));
      const appContentService = container.get<IAppContentService>(Types.IAppContentService);
      const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
      const token = appSettings.getValue(SettingsKeys.CurrentAccessToken);

      const shoes = await appContentService.getShoesByIds(token, ids);
      dispatch(updateGetShoesState({ state: NetworkRequestState.SUCCESS, shoes, error: undefined }));
    } catch (e) {
      dispatch(updateGetShoesState({ state: NetworkRequestState.FAILED, error: e }));
    }
  };
};
