import {IAppleAuthSdk} from 'business';
import AppleAuth, {
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

export class AppleAuthSdk implements IAppleAuthSdk {
  public async signIn(): Promise<string> {
    const appleAuthRequestResponse = await AppleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [],
    });

    return appleAuthRequestResponse.identityToken;
  }
}
