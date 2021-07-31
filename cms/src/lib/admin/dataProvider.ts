import {DataProvider, fetchUtils} from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import {StorageKey} from './authProvider';

const {REACT_APP_SERVER_ENDPOINT} = process.env;

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
  restProvider(REACT_APP_SERVER_ENDPOINT!, httpClient, 'X-Total-Count');

export default getDataProvider;
