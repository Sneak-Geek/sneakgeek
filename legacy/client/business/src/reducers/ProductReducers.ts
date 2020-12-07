import { NetworkRequestState, GetReviewsPayload, GetShoeInfoPayload } from "../payload";
import { Review, SellOrder, BuyOrder, Shoe } from "../model";
import { Action } from "redux-actions";
import { updateStateGetReviews, updateStateGetInfo } from "../actions/ShoeActions";
import { handleActionsWithReset } from "../utilities/ReduxUtilities";

export type IProductState = {
  reviewState: {
    state: NetworkRequestState;
    error?: any;
    reviews: Review[];
  };
  infoState: {
    state: NetworkRequestState;
    error?: any;
    relatedShoes: Shoe[];
    lowestSellOrder?: SellOrder;
    highestBuyOrder?: BuyOrder;
  };
};

export const initialProductState: IProductState = {
  reviewState: {
    state: NetworkRequestState.NOT_STARTED,
    reviews: [],
  },
  infoState: {
    state: NetworkRequestState.NOT_STARTED,
    relatedShoes: [],
  },
};

export const ProductReducers = handleActionsWithReset<IProductState, any>(
  {
    [`${updateStateGetReviews}`]: (
      state: IProductState,
      action: Action<GetReviewsPayload>
    ) => ({
      ...state,
      reviewState: {
        ...state.reviewState,
        reviews: action.payload.data || [],
        state: action.payload.state,
        error: action.payload.error,
      },
    }),
    [`${updateStateGetInfo}`]: (
      state: IProductState,
      action: Action<GetShoeInfoPayload>
    ) => ({
      ...state,
      infoState: {
        ...state.infoState,
        relatedShoes: action.payload.data?.relatedShoes || [],
        highestBuyOrder: action.payload.data?.highestBuyOrder,
        lowestSellOrder: action.payload.data?.lowestSellOrder,
        state: action.payload.state,
        error: action.payload.error,
      },
    }),
  },
  initialProductState
);
