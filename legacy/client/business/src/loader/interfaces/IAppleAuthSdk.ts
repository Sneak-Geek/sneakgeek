export interface IAppleAuthSdk {
  signIn: () => Promise<string>;
}
