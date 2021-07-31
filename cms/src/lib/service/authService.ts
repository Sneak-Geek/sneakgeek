import axios, {AxiosResponse} from 'axios';
import Account from '../../models/Account';
import {SERVICE_ENDPOINT} from './common';

export type IdentityPayload = {
  account: Account;
};

type AuthPayload = IdentityPayload & {token: string};

const login = (
  username: string,
  password: string,
): Promise<AxiosResponse<AuthPayload>> => {
  return axios.post(`${SERVICE_ENDPOINT}/account/auth/email/login`, {
    email: username,
    password,
  });
};

const logout = (): Promise<AxiosResponse<void>> => {
  return axios.get(`${SERVICE_ENDPOINT}/account/logout`);
};

const getIdentity = (
  token: string,
): Promise<AxiosResponse<IdentityPayload>> => {
  return axios.get(`${SERVICE_ENDPOINT}/account`, {
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
