import * as util from './util';

describe('util', () => {
  test('toVietnamCurrency', () => {
    expect(util.toVietnamCurrency(1000000)).toEqual('₫1,000,000');
  });
});
