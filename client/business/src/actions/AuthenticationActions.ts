import { createAction } from "redux-actions";
import { AuthenticationPayload, NetworkRequestState } from "../payload";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { IAccountService, ISettingsProvider, IFacebookSDK } from "../loader";
import { SettingsKey, IGoogleSDK, IAppleAuthSdk } from "../loader/interfaces";
import { getUserProfile } from "./ProfileActions";
//import {Account} from '../model';
import { Dispatch } from "redux";
import {auth, firebase} from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const AuthenticationActions = {
  UPDATE_AUTHENTICATION_STATE: "UPDATE_AUTHENTICATION_STATE",
};

export const updateAuthenticationState = createAction<AuthenticationPayload>(
  AuthenticationActions.UPDATE_AUTHENTICATION_STATE
);

export const getCurrentUser = () => {
  /*const accountService = ObjectFactory.getObjectInstance<IAccountService>(
    FactoryKeys.IAccountService
  );*/
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider
  );

  return async (dispatch: Dispatch<any>) => {
    dispatch(
      updateAuthenticationState({ state: NetworkRequestState.REQUESTING })
    );
    //const token = settings.getValue(SettingsKey.CurrentAccessToken);
    
    try {
      const userProfile = await firebase.auth().currentUser;
      if (userProfile) {
        await settings.loadServerSettings();
        dispatch(getUserProfile());
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.SUCCESS,
            data: undefined, //userAccount: Account //userProfile,
          })
        );
      } else {
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.FAILED,
            error: new Error("Empty account"),
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const authenticateWithEmail = (
  email: string,
  password: string,
  isSignUp: boolean = false
) => {
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider
  );

  return async (dispatch: Function) => {
    dispatch(
      updateAuthenticationState({ state: NetworkRequestState.REQUESTING })
    );
      if (!isSignUp)
      {
        try
        {
          const response = await firebase.auth().signInWithEmailAndPassword(email, password);
          if(response.user)
          {
            console.log('User signed in!');
            dispatch(getUserProfile());
            dispatch(
              updateAuthenticationState({
                state: NetworkRequestState.SUCCESS,
                data: undefined, //userAccount: Account,
              })
            );
          }
        }
        catch (error){
          console.error(error);
          dispatch(
            updateAuthenticationState({
              state: NetworkRequestState.FAILED,
              error: error,
            })
          );
        }
      }
      else
      {
        try
        {
          const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
          
          if(response.user)
          {
            console.log('User account created & signed in!');
            dispatch(getUserProfile());
            dispatch(
              updateAuthenticationState({
                state: NetworkRequestState.SUCCESS,
                data: undefined, //userAccount: Account,
              })
            );
          }
          /*else
          {
            .catch((error) => {
              if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
              }

              if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
              }
              console.error(error);
              dispatch(
                updateAuthenticationState({
                  state: NetworkRequestState.FAILED,
                  error: new Error("Empty account"),
                })
              );
            });*/
        }
        catch(error){
          /*if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }*/
          console.error(error);
          dispatch(
            updateAuthenticationState({
              state: NetworkRequestState.FAILED,
              error: error,
            })
          );
        }
      }
      const token = undefined;//await firebase.auth().currentUser.getIdToken();
      await settings.setValue(
        SettingsKey.CurrentAccessToken,
        token
      );
      await settings.loadServerSettings();
  };
};

export const authenticateWithFb = () => {
  return async (dispatch: Function) => {
    const permissions = ["public_profile", "email"];
    const fbSdk = ObjectFactory.getObjectInstance<IFacebookSDK>(
      FactoryKeys.IFacebookSDK
    );
    /*const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );*/
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    try {
      const loginResult = await fbSdk.loginWithPermission(permissions);

      if (loginResult.isCancelled) {
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.FAILED,
          })
        );
      } else {
        const accessToken = await fbSdk.getCurrentAccessToken();
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(accessToken);
        auth().signInWithCredential(facebookCredential);
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          accountPayload!.token? //accessToken
        );
        dispatch(getUserProfile());
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.SUCCESS,
            data: undefined, //userAccount: Account,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const authenticateWithGoogle = () => {
  return async (dispatch: Function) => {
    const ggSdk = ObjectFactory.getObjectInstance<IGoogleSDK>(
      FactoryKeys.IGoogleSDK
    );
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );
    try {
      const signInResult = await ggSdk.signIn();
      if (signInResult && signInResult.idToken) {
        const accessToken = signInResult.idToken;
        const accountPayload = await accountService.login(
          accessToken as string,
          "google"
        );
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          accountPayload?.token
        );
        dispatch(getUserProfile());
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.SUCCESS,
            data: accountPayload,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const authenticateWithApple = () => {
  return async (dispatch: Dispatch<any>) => {
    /*const appleSdk = ObjectFactory.getObjectInstance<IAppleAuthSdk>(
      FactoryKeys.IAppleAuthSdk
    );*/

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      console.error('Apple Sign-In failed - no identify token returned');
    }

    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    try {
      /*const payload = await appleSdk.signIn();
      const accountPayload = await accountService.login(`${payload.email}+${payload.idToken}`, "apple");*/
      auth().signInWithCredential(appleCredential);
      await settings.setValue(
        SettingsKey.CurrentAccessToken,
        identityToken //TODO Thinh 08/05/2021: is this the token we want?
      );
      dispatch(getUserProfile());
      dispatch(
        updateAuthenticationState({
          state: NetworkRequestState.SUCCESS,
          data: undefined, //userAccount: Account,
        })
      );
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};
