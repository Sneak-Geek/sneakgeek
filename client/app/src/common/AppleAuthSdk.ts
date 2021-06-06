import {IAppleAuthSdk} from 'business';
import AppleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';

export class AppleAuthSdk implements IAppleAuthSdk {
  public async signIn(): Promise<{idToken: string; email: string}> {
    const appleAuthRequestResponse = await AppleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL],
    });

    return {
      idToken: appleAuthRequestResponse.identityToken,
      email: appleAuthRequestResponse.email,
    };
  }
}
