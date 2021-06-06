import { createAction } from "redux-actions";
import { CatalogPayload, NetworkRequestState, HomePageCatalogsPayload } from "../payload";
import { ICatalogService, ISettingsProvider, SettingsKey } from "../loader/interfaces";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { Dispatch, AnyAction } from "redux";
import { updateAuthenticationState } from "./AuthenticationActions";

export const CatalogActions = {
  UPDATE_STATE_GET_ALL_CATALOG: "UPDATE_STATE_GET_ALL_CATALOG",
  UPDATE_STATE_GET_HOME_PAGE_CATALOGS: "UPDATE_STATE_GET_HOME_PAGE_CATALOGS"
};

export const updateCatalogState = createAction<CatalogPayload>(
  CatalogActions.UPDATE_STATE_GET_ALL_CATALOG
);
export const updateGetHomeCatalogsState = createAction<HomePageCatalogsPayload>(
  CatalogActions.UPDATE_STATE_GET_HOME_PAGE_CATALOGS
)

export const getAllCatalogs = () => {
  const catalogService = ObjectFactory.getObjectInstance<ICatalogService>(
    FactoryKeys.ICatalogService
  );
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider
  );

  return async (dispatch: Dispatch<any>) => {
    dispatch(updateCatalogState({ state: NetworkRequestState.REQUESTING }));
    const token = settings.getValue(SettingsKey.CurrentAccessToken);

    try {
      const catalogPayload = await catalogService.getAllCatalogs(token);
      if (catalogPayload) {
        dispatch(
          updateCatalogState({
            state: NetworkRequestState.SUCCESS,
            data: catalogPayload
          })
        );
      } else {
        dispatch(
          updateCatalogState({
            state: NetworkRequestState.FAILED,
            error: new Error("Empty catalog payload")
          })
        );
      }
    } catch (error) {
      dispatch(updateAuthenticationState({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const getHomeCatalogs = () => {
  const catalogService = ObjectFactory.getObjectInstance<ICatalogService>(FactoryKeys.ICatalogService);

  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(updateGetHomeCatalogsState({ state: NetworkRequestState.REQUESTING }));

    try {
      const [Nike, Jordan, adidas, hot, ranking, toppick, buynow] = await Promise.all([
        catalogService.getCatalogByTag("nike"),
        catalogService.getCatalogByTag("jordan"),
        catalogService.getCatalogByTag("adidas"),
        catalogService.getCatalogByTag("hot"),
        catalogService.getCatalogByTag("ranking"),
        catalogService.getCatalogByTag("toppick"),
        catalogService.getCatalogByTag("buynow")
      ]);

      dispatch(updateGetHomeCatalogsState({
        state: NetworkRequestState.SUCCESS,
        data: { Nike, Jordan, adidas, hot, ranking, toppick, buynow }
      }));
    } catch (err) {
      dispatch(updateGetHomeCatalogsState({
        state: NetworkRequestState.FAILED,
        error: err
      }));
    }
  }
}
