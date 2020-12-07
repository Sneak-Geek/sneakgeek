import {IFacebookSDK, LoginResult, Permissions} from 'business';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

export class FacebookSdk implements IFacebookSDK {
  public async loginWithPermission(
    permissions: Permissions[],
  ): Promise<LoginResult> {
    const result = await LoginManager.logInWithPermissions(permissions);

    return {
      isCancelled: result.isCancelled,
      error: result.error,
      declinedPermissions: result.declinedPermissions,
      grantedPermissions: result.grantedPermissions,
    };
  }

  public async getCurrentAccessToken(): Promise<string> {
    const wrappedToken = await AccessToken.getCurrentAccessToken();
    return wrappedToken.accessToken;
  }
}
