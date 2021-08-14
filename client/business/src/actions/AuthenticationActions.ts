import { createAction } from "redux-actions";
import { AuthenticationPayload, NetworkRequestState } from "../payload";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import {  IAccountService, ISettingsProvider, IFacebookSDK} from "../loader";
import { SettingsKey } from "../loader/interfaces";
import { updateStateGetUserProfile } from "./ProfileActions";
import { Dispatch } from "redux";
import {firebase} from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const AuthenticationActions = {
  UPDATE_AUTHENTICATION_STATE: "UPDATE_AUTHENTICATION_STATE",
};

export const updateAuthenticationState = createAction<AuthenticationPayload>(
  AuthenticationActions.UPDATE_AUTHENTICATION_STATE
);

export const verifyEmail = (email: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(
      updateStateGetUserProfile({ state: NetworkRequestState.REQUESTING })
    );
    try
    {
      console.log("Verifying Email: ");
      const response = await firebase.auth().fetchSignInMethodsForEmail(email);
      console.log("Finish Verifying Email: ", response);
      if (response.length > 0)
      {
        dispatch(
        updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error: new Error("Has Signin Method") })
        );
      }
      else
      {
        dispatch(
        updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error: new Error("No Signin Method") })
        );
      }
    }
    catch (error){
      dispatch(
      updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const getCurrentUser = () => {
  const accountService = ObjectFactory.getObjectInstance<IAccountService>(
    FactoryKeys.IAccountService
  );
  return async (dispatch: Dispatch<any>) => {
    dispatch(
      updateAuthenticationState({ state: NetworkRequestState.REQUESTING })
    );
    
    try {
      const userProfile = await firebase.auth().currentUser;
      const firebaseToken = userProfile ? await userProfile.getIdToken() : undefined;
      
      if (userProfile && firebaseToken) {
        try {
          await userProfile.reload();
          const profile = await accountService.getUserProfile(firebaseToken);
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
      } else {
        dispatch(
          updateStateGetUserProfile({
            state: NetworkRequestState.FAILED,
            error: new Error("Empty account"),
          })
        );
      }
    } catch (error) {
      dispatch(
        updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error })
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

  const accountService = ObjectFactory.getObjectInstance<IAccountService>(
    FactoryKeys.IAccountService
  );

  return async (dispatch: Function) => {
    dispatch(
      updateStateGetUserProfile({ state: NetworkRequestState.REQUESTING })
    );

    try
    {
      const response = isSignUp ? await firebase.auth().createUserWithEmailAndPassword(email, password)
          : await firebase.auth().signInWithEmailAndPassword(email, password);
      if(response.user)
      {
        if (isSignUp)
        {
          await response.user.sendEmailVerification();
        }
        const token = await response.user.getIdToken();
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          token
        );
        try {
          const profile = await accountService.getUserProfile(token);
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
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );

    try {
      const loginResult = await fbSdk.loginWithPermission(permissions);

      if (loginResult.isCancelled) {
        dispatch(
          updateStateGetUserProfile({
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
          await settings.setValue(
            SettingsKey.CurrentAccessToken,
            token
          );

          try {
            const profile = await accountService.getUserProfile(token);
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
        }
      }
    } catch (error) {
      dispatch(
        updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error })
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
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL],
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
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          token
        );
        try {
          const profile = await accountService.getUserProfile(token);
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
      }
    } catch (error) {
      dispatch(
        updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};


