export type ClientToken = {
  iss: string;
  iat: number;
  exp: number;
  aud: string;
  sub: string;
};

export interface IAppleAuthService {
  getUserToken: (idToken: string) => Promise<ClientToken>;
}
