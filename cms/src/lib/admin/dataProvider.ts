import {DataProvider, fetchUtils} from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import {SERVICE_ENDPOINT} from '../service/common';
import {StorageKey} from './authProvider';

const defaultHttpClient = (url: string, options: any) => {
  options = options || {};
  if (!options?.headers) {
    options.headers = new Headers({
      Accept: 'application/json',
    });
  }

  (options.headers as any).set(
    'Authorization',
    localStorage.getItem(StorageKey.token) || '',
  );

  return fetchUtils.fetchJson(url, options);
};

const getDataProvider = (httpClient = defaultHttpClient): DataProvider =>
  restProvider(SERVICE_ENDPOINT, httpClient, 'X-Total-Count');

export default getDataProvider;
