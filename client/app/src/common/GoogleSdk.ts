import {SignInResult, IGoogleSDK} from 'business';
import {GoogleSignin} from '@react-native-community/google-signin';

export class GoogleSdk implements IGoogleSDK {
  constructor() {
    GoogleSignin.configure({
      webClientId:
        '660034538610-kta7viku38o1poqpjlh3dkpmvp4b48dj.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  public async signIn(): Promise<SignInResult> {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    if (hasPlayServices) {
      return GoogleSignin.signIn();
    }

    return undefined;
  }
}
