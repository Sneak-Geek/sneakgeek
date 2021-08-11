import { createAction } from "redux-actions";
import { Dispatch, AnyAction } from "redux";
import { GetUserProfilePayload, NetworkRequestState } from "../payload";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { IAccountService, ISettingsProvider, SettingsKey } from "../loader";
import { Profile } from "../model";

export const ProfileActions = {
  UPDATE_STATE_GET_USER_PROFILE: "UPDATE_GET_USER_PROFILE",
  SET_PROFILE: "SET_PROFILE"
};

export const updateStateGetUserProfile = createAction<GetUserProfilePayload>(
  ProfileActions.UPDATE_STATE_GET_USER_PROFILE
);
export const updateProfile = createAction<Profile>(ProfileActions.SET_PROFILE);

export const getUserProfile = () => {
  console.log("Inside getUserProfile: ");
  return async (dispatch: Dispatch<AnyAction>) => {
    console.log("Inside return async");
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    console.log("Got account service");
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );
    console.log("Before updateStateGetUserProfile");
    dispatch(updateStateGetUserProfile({ state: NetworkRequestState.REQUESTING }));
    console.log("Before Get Token");
    const token = settings.getValue(SettingsKey.CurrentAccessToken);
    console.log("Token in getUserProfile: ", token);
    try {
      const profile: Profile | undefined = await accountService.getUserProfile(token);
      console.log("Got user profile: ", profile);
      if (profile) {
        dispatch(updateStateGetUserProfile({
          state: NetworkRequestState.SUCCESS,
          data: { profile }
        }));
      } else {
        dispatch(updateStateGetUserProfile({
          state: NetworkRequestState.FAILED,
          error: new Error("Empty profile ")
        }));
      }
    } catch (error) {
      updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error });
    }
  };
};
