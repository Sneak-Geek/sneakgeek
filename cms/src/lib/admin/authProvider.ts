import {AuthProvider} from 'react-admin';
import authService from '../service/authService';
import HttpStatus from 'http-status';

export const StorageKey = {
  token: 'TOKEN',
  permission: 'PERMISSION',
};

const authProvider: AuthProvider = {
  login: async ({username, password}) => {
    localStorage.removeItem(StorageKey.token);
    const res = await authService.login(username, password);

    localStorage.setItem(StorageKey.token, res.data.token);
    localStorage.setItem(
      StorageKey.permission,
      res.data.account.accessLevel.toString(),
    );
  },
  checkError: ({status}) => {
    return status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN
      ? Promise.reject()
      : Promise.resolve();
  },
  checkAuth: () => {
    if (localStorage.getItem(StorageKey.token)) {
      return Promise.resolve();
    }
    return Promise.reject({redirectTo: '/login'});
  },
  logout: async () => {
    await authService.logout();
    localStorage.removeItem(StorageKey.token);
  },
  getIdentity: async () => {
    const token = localStorage.getItem(StorageKey.token);
    if (!token) {
      return Promise.reject({redirectTo: '/login'});
    }
    const {
      data: {account},
    } = await authService.getIdentity(token!);
    const {accountNameByProvider: name} = account;
    return Promise.resolve({
      id: account.id,
      fullName: `${name.givenName} ${name.familyName}`,
      avatar: account.accountProfilePicByProvider,
    });
  },
  getPermissions: () => {
    return Promise.resolve(localStorage.getItem(StorageKey.permission));
  },
};

export default authProvider;
