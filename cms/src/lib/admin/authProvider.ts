import {AuthProvider} from 'react-admin';
import authService from '../service/authService';
import HttpStatus from 'http-status';

export const StorageKey = {
  token: 'TOKEN',
  permission: 'PERMISSION',
};

const authProvider: AuthProvider = {
  login: async ({username, password}) => {
    const res = await authService.login(username, password);
    if (res) {
      localStorage.setItem(
        StorageKey.permission,
        res.data.profile.accessLevel.toString(),
      );
      const token = await authService.getUserToken();
      localStorage.setItem(StorageKey.token, token as string);
    } 
  },
  checkError: ({status}) => {
    return status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN
      ? Promise.reject()
      : Promise.resolve();
  },
  checkAuth: async () => {
    const token = localStorage.getItem(StorageKey.token);
    if (token) {
      return Promise.resolve();
    }
    return Promise.reject({redirectTo: '/login'});
  },
  logout: async () => {
    await authService.logout();
  },
  getIdentity: async () => {
    const token = await authService.getUserToken();
    if (!token) {
      return Promise.reject({redirectTo: '/login'});
    }
    localStorage.setItem(StorageKey.token, token);
    const {
      data: {profile},
    } = await authService.getIdentity(token);
    const {userProvidedName: name} = profile;
    return Promise.resolve({
      id: profile.id,
      fullName: `${name?.firstName || ''} ${name?.lastName || ''}`,
    });
  },
  getPermissions: () => {
    return Promise.resolve(localStorage.getItem(StorageKey.permission));
  },
};

export default authProvider;
