import { NetworkRequestState, CatalogPayload, HomePageCatalogsPayload } from "../payload";
import { Catalog } from "../model";
import { updateCatalogState, updateGetHomeCatalogsState } from "../actions/CatalogActions";
import { Action } from "redux-actions";
import { handleActionsWithReset } from "../utilities/ReduxUtilities";

export type ICatalogState = {
  catalogState: {
    state: NetworkRequestState;
    error?: any;
    catalogs?: Catalog[];
  };
  homepageCatalogState: {
    state: NetworkRequestState;
    error?: any;
    catalogs?: {
      hot: Catalog;
      [key: string]: Catalog;
    };
  };
};

export const initialCatalogState: ICatalogState = {
  catalogState: {
    state: NetworkRequestState.NOT_STARTED,
  },
  homepageCatalogState: {
    state: NetworkRequestState.NOT_STARTED,
  },
};

export const CatalogReducers = handleActionsWithReset<ICatalogState, any>(
  {
    [`${updateCatalogState}`]: (state: ICatalogState, action: Action<CatalogPayload>) => ({
      ...state,
      catalogState: {
        state: action.payload.state,
        error: action.payload.error,
        catalogs: action.payload.data,
      },
    }),
    [`${updateGetHomeCatalogsState}`]: (
      state: ICatalogState,
      action: Action<HomePageCatalogsPayload>
    ) => ({
      ...state,
      homepageCatalogState: {
        error: action.payload.error,
        state: action.payload.state,
        catalogs: action.payload.data,
      },
    }),
  },
  initialCatalogState
);
