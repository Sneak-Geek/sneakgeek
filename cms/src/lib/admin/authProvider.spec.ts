import {AxiosResponse} from 'axios';
import Account from '../../models/Account';
import authService, {IdentityPayload} from '../service/authService';
import authProvider from './authProvider';

describe('authProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('authProvider: login', async () => {
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(authService, 'login').mockReturnValue(
      Promise.resolve({
        data: {
          token: 'token',
          account: {
            accessLevel: 1,
          } as Account,
        },
      } as AxiosResponse<any>),
    );

    await authProvider.login({username: 'Hello', password: 'password'});
    expect(localStorage.setItem).toBeCalledTimes(2);
    expect(localStorage.setItem).toBeCalledWith('TOKEN', 'token');
    expect(localStorage.setItem).toBeCalledWith('PERMISSION', '1');
  });

  test('authProvider: checkAuth valid token', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token');

    expect(authProvider.checkAuth(null)).resolves.toBe(undefined);
  });

  test('authProvider: logout', async () => {
    jest
      .spyOn(authService, 'logout')
      .mockResolvedValue({data: null} as AxiosResponse<any>);
    jest.spyOn(Storage.prototype, Storage.prototype.removeItem.name);
    await authProvider.logout(null);

    expect(localStorage.removeItem).toBeCalledTimes(1);
    expect(localStorage.removeItem).toBeCalledWith('TOKEN');
  });

  test('authProvider: getIdentity', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token');
    expect(localStorage.getItem('TOKEN')).toBe('token');
    expect(authProvider.getIdentity).toBeDefined();

    // mock authService
    jest.spyOn(authService, 'getIdentity').mockReturnValue(
      Promise.resolve({
        data: {
          account: {
            id: 'id',
            accountNameByProvider: {
              familyName: 'lastName',
              givenName: 'firstName',
            },
            accountProfilePicByProvider: 'profilePic',
          },
        } as IdentityPayload,
      } as AxiosResponse<any>),
    );

    expect(authProvider.getIdentity!()).resolves.toHaveProperty('id');
    expect(authProvider.getIdentity!()).resolves.toHaveProperty('avatar');
    expect(authProvider.getIdentity!()).resolves.toHaveProperty('fullName');
    expect(authProvider.getIdentity!()).resolves.toEqual({
      id: 'id',
      fullName: 'firstName lastName',
      avatar: 'profilePic',
    });
  });

  test('authProvider: getPermissions', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('permission');
    expect(authProvider.getPermissions(null)).resolves.toBeDefined();
    expect(authProvider.getPermissions(null)).resolves.toBe('permission');
  });
});
