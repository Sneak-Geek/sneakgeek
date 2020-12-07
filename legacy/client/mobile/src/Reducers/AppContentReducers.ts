// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action } from "redux-actions";
import { updateGetShoesState, updateSearchShoesState, updateShoesData, updateStateRequestProduct } from "../Actions";
import { Shoe } from "../Shared/Model";
import { GetShoesPayload, RequestProductPayload, SearchShoePayload } from "../Shared/Payload";
import { NetworkRequestState } from "../Shared/State";
import { handleActionsWithReset } from "../Utilities/ReduxUtilities";

export interface IAppContentState {
  shoes: Shoe[];
  getShoesState: {
    state: NetworkRequestState;
    shoes?: Shoe[];
    error?: any;
  };
  searchShoesState: {
    shoes?: Shoe[];
    state: NetworkRequestState;
    error?: any;
  };
  requestProductState: {
    state: NetworkRequestState;
    error?: any;
  };
}

const initialAppContentState: IAppContentState = {
  shoes: [],
  getShoesState: {
    state: NetworkRequestState.NOT_STARTED,
    shoes: []
  },
  searchShoesState: {
    shoes: [],
    state: NetworkRequestState.NOT_STARTED
  },
  requestProductState: {
    state: NetworkRequestState.NOT_STARTED
  }
};

export const AppContentReducers = handleActionsWithReset<IAppContentState, any>(
  {
    [`${updateShoesData}`]: (state: IAppContentState, action: Action<Shoe[]>) => {
      return Object.assign({}, state, { shoes: action.payload });
    },
    [`${updateSearchShoesState}`]: (state: IAppContentState, action: Action<SearchShoePayload>) => {
      const { payload } = action;
      let result = {
        ...state,
        searchShoesState: {
          shoes: payload.shoes,
          state: payload.state,
          error: payload.error
        }
      };

      if (payload.shoes && payload.shoes.length > 0) {
        result = { ...result, shoes: [...result.shoes, ...payload.shoes] };
      }
      return result;
    },
    [`${updateGetShoesState}`]: (state: IAppContentState, action: Action<GetShoesPayload>) => ({
      ...state,
      getShoesState: {
        ...state.getShoesState,
        ...action.payload
      }
    }),
    [`${updateStateRequestProduct}`]: (state: IAppContentState, action: Action<RequestProductPayload>) => ({
      ...state,
      requestProductState: {
        ...state.requestProductState,
        ...action.payload
      }
    })
  },
  initialAppContentState
);
