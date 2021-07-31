import axios, {AxiosResponse} from 'axios';
import Account from '../../models/Account';
const {REACT_APP_SERVER_ENDPOINT} = process.env;

console.log("server endpoint", REACT_APP_SERVER_ENDPOINT);

export type IdentityPayload = {
  account: Account;
};

type AuthPayload = IdentityPayload & {token: string};

const login = (
  username: string,
  password: string,
): Promise<AxiosResponse<AuthPayload>> => {
  return axios.post(`${REACT_APP_SERVER_ENDPOINT}/account/auth/email/login`, {
    email: username,
    password,
  });
};

const logout = (): Promise<AxiosResponse<void>> => {
  return axios.get(`${REACT_APP_SERVER_ENDPOINT}/account/logout`);
};

const getIdentity = (
  token: string,
): Promise<AxiosResponse<IdentityPayload>> => {
  return axios.get(`${REACT_APP_SERVER_ENDPOINT}/account`, {
    headers: {
      authorization: token,
    },
  });
};

const authService = {
  login,
  logout,
  getIdentity,
};

export default authService;
