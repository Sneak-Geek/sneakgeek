import {SERVICE_ENDPOINT} from '../service/common';
import getDataProvider from './dataProvider';

describe('dataProvider', () => {
  let httpClient: (url: string, options: any) => any;

  test('service endpoint is set correctly', () => {
    httpClient = jest.fn().mockReturnValue(
      Promise.resolve({
        headers: {
          'X-Total-Count': 100,
        },
        json: {},
      }),
    );
    const adminDataProvider = getDataProvider(httpClient);

    adminDataProvider.getList('orders', {
      pagination: {page: 0, perPage: 10},
      sort: {field: 'id', order: 'asc'},
      filter: {},
    });

    expect(httpClient).toBeCalledWith(
      `${SERVICE_ENDPOINT}/orders?filter=%7B%7D&range=%5B-10%2C-1%5D&sort=%5B%22id%22%2C%22asc%22%5D`,
      {},
    );
  });
});
