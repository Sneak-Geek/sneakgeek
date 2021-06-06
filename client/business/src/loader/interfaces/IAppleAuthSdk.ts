export interface IAppleAuthSdk {
  signIn: () => Promise<{idToken: string, email: string}>;
}
