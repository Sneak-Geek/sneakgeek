import { createAction } from "redux-actions";
import { AuthenticationPayload, NetworkRequestState } from "../payload";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { ISettingsProvider, IFacebookSDK, IAccountService} from "../loader";
import { SettingsKey } from "../loader/interfaces";
import { getUserProfile, updateStateGetUserProfile } from "./ProfileActions";
import { Dispatch } from "redux";
import {firebase} from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const AuthenticationActions = {
  UPDATE_AUTHENTICATION_STATE: "UPDATE_AUTHENTICATION_STATE",
};

export const updateAuthenticationState = createAction<AuthenticationPayload>(
  AuthenticationActions.UPDATE_AUTHENTICATION_STATE
);

export const getCurrentUser = () => {
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider
  );
  const accountService = ObjectFactory.getObjectInstance<IAccountService>(
    FactoryKeys.IAccountService
  );
  return async (dispatch: Dispatch<any>) => {
    dispatch(
      updateAuthenticationState({ state: NetworkRequestState.REQUESTING })
    );
    
    try {
      const token = settings.getValue(SettingsKey.CurrentAccessToken);
      const userProfile = await firebase.auth().currentUser;
      const firebaseToken = userProfile ? userProfile.getIdToken() : undefined;
      if (userProfile && token == firebaseToken) {
        const accountPayload = await accountService.getCurrentUser(token);
        if (accountPayload)
        {
          await settings.loadServerSettings();
          dispatch(getUserProfile());
          dispatch(
            updateAuthenticationState({
              state: NetworkRequestState.SUCCESS,
              data: accountPayload
            })
          );
        }
        else
        {
          dispatch(
            updateAuthenticationState({
              state: NetworkRequestState.FAILED,
              error: new Error("Empty account"),
            })
          );
        }
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
  const accountService = ObjectFactory.getObjectInstance<IAccountService>(
    FactoryKeys.IAccountService
  );

  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider
  );

  return async (dispatch: Function) => {
    dispatch(
      updateAuthenticationState({ state: NetworkRequestState.REQUESTING })
    );

    try
    {
      const response = isSignUp ? await firebase.auth().createUserWithEmailAndPassword(email, password)
          : await firebase.auth().signInWithEmailAndPassword(email, password);
      if(response.user)
      {
        if (isSignUp)
        {
          /*var accountSetting : ActionCodeSettings;
          accountSetting.handleCodeInApp = false;*/
          await response.user.sendEmailVerification();
        }
        const token = await response.user.getIdToken();
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          token
        );
        console.log("Token: ", token);
        const profile = await accountService.getUserProfile(token);
        if (profile) {
          await settings.loadServerSettings();
          dispatch(
            updateStateGetUserProfile({
              state: NetworkRequestState.SUCCESS,
              data: { profile },
            })
          );
        }
      }
    }
    catch (error){
      console.error(error);
      dispatch(
        updateStateGetUserProfile({
          state: NetworkRequestState.FAILED,
          error: error,
        })
      );
    }
  };
};

export const authenticateWithFb = () => {
  return async (dispatch: Function) => {
    const permissions = ["public_profile", "email"];
    const fbSdk = ObjectFactory.getObjectInstance<IFacebookSDK>(
      FactoryKeys.IFacebookSDK
    );
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
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
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(accessToken);
        const response = await firebase.auth().signInWithCredential(facebookCredential);
        if(response.user)
        {
          const token = await response.user.getIdToken();
          const accountPayload = await accountService.getCurrentUser(token);
          if (accountPayload) {
            await settings.setValue(
              SettingsKey.CurrentAccessToken,
              token
            );
            dispatch(getUserProfile());
            dispatch(
              updateAuthenticationState({
                state: NetworkRequestState.SUCCESS,
                data: accountPayload,
              })
            );
          }
        }
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

// export const authenticateWithGoogle = () => {
//   return async (dispatch: Function) => {
//     const accountService = ObjectFactory.getObjectInstance<IAccountService>(
//       FactoryKeys.IAccountService
//     );
//     const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
//       FactoryKeys.ISettingsProvider
//     );
//     try {
//       const { idToken } = await GoogleSignin.signIn();
//       if (idToken) {
//         const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
//         const response = await firebase.auth().signInWithCredential(googleCredential);
//         if(response.user)
//         {
//           const token = await response.user.getIdToken();
//           const accountPayload = await accountService.getCurrentUser(token);
//           if (accountPayload) {
//             await settings.setValue(
//               SettingsKey.CurrentAccessToken,
//               token
//             );
//             dispatch(getUserProfile());
//             dispatch(
//               updateAuthenticationState({
//                 state: NetworkRequestState.SUCCESS,
//                 data: accountPayload
//               })
//             );
//           }
//         }
//       }
//     } catch (error) {
//       dispatch(
//         updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
//       );
//     }
//   };
// };

export const authenticateWithApple = () => {
  return async (dispatch: Dispatch<any>) => {
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      }); 
      if (!appleAuthRequestResponse.identityToken) {
        console.error('Apple Sign-In failed - no identify token returned');
      }
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
  
      const response = await firebase.auth().signInWithCredential(appleCredential);
      if(response.user)
      {
        const token = await response.user.getIdToken();
        const accountPayload = await accountService.getCurrentUser(token);
        if (accountPayload) {
          await settings.setValue(
            SettingsKey.CurrentAccessToken,
            token
          );
          dispatch(getUserProfile());
          dispatch(
            updateAuthenticationState({
              state: NetworkRequestState.SUCCESS,
              data: accountPayload,
            })
          );
        }
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const resetPassword = (email: string) => {
  return async (dispatch: Dispatch<any>) => { 
    try {
      await firebase.auth().sendPasswordResetEmail(email);
    } catch(error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  }
}
