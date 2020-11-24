import { Dispatch, AnyAction } from "redux"
import { createAction } from "redux-actions"
import {
  SearchShoesPayload,
  NetworkRequestState,
  GetReviewsPayload,
  GetShoeInfoPayload,
} from "../payload"
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { IShoeService, ISettingsProvider, SettingsKey } from "../loader/interfaces";
import { Review } from "../model";

export const ShoeActions = {
  UPDATE_STATE_SEARCH_SHOES: "UPDATE_STATE_SEARCH_SHOES",
  UPDATE_STATE_GET_REVIEWES: "UPDATE_STATE_GET_REVIEWS",
  UPDATE_STATE_GET_DETAIL: "UPDATE_STATE_GET_DETAIL",
};

export const updateStateSearchShoes = createAction<SearchShoesPayload>(ShoeActions.UPDATE_STATE_SEARCH_SHOES);
export const updateStateGetReviews = createAction<GetReviewsPayload>(ShoeActions.UPDATE_STATE_SEARCH_SHOES);
export const updateStateGetInfo = createAction<GetShoeInfoPayload>(ShoeActions.UPDATE_STATE_GET_DETAIL);

function getShoeServiceAndToken() {
  const shoeService = ObjectFactory.getObjectInstance<IShoeService>(FactoryKeys.IShoeService);
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(FactoryKeys.ISettingsProvider);
  const token = settings.getValue(SettingsKey.CurrentAccessToken);
  return { shoeService, token }
}

export const searchShoes = (key: string,
  page: number) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(updateStateSearchShoes({
      state: NetworkRequestState.REQUESTING,
    }));
    const shoeService = ObjectFactory.getObjectInstance<IShoeService>(FactoryKeys.IShoeService);
    try {
      const { shoes } = await shoeService.searchShoes(key, page);

      dispatch(updateStateSearchShoes({
        state: NetworkRequestState.SUCCESS,
        data: shoes
      }));
    } catch (error) {
      dispatch(updateStateSearchShoes({
        state: NetworkRequestState.FAILED,
        error
      }));
    }
  }
}

export const getReviews = (shoeId: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(updateStateGetReviews({ state: NetworkRequestState.REQUESTING }));

    const shoeService = ObjectFactory.getObjectInstance<IShoeService>(FactoryKeys.IShoeService);

    try {
      const reviews: Review[] = await shoeService.getShoeReviews(shoeId);

      dispatch(updateStateGetReviews({
        state: NetworkRequestState.SUCCESS,
        data: reviews
      }));
    } catch (error) {
      dispatch(updateStateGetReviews({
        state: NetworkRequestState.FAILED,
        error,
      }));
    }
  }
}

export const getShoeInfo = (shoeId: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const { shoeService } = getShoeServiceAndToken();
    dispatch(updateStateGetInfo({ state: NetworkRequestState.NOT_STARTED }));
    try {
      const data = await shoeService.getShoeInfo(shoeId);
      dispatch(updateStateGetInfo({
        state: NetworkRequestState.SUCCESS,
        data
      }))
    } catch (error) {
      dispatch(updateStateGetInfo({
        state: NetworkRequestState.FAILED,
        error
      }));
    }
  }
}