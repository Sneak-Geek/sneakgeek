import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('renders App correctly', () => {
  const {queryAllByTestId} = render(<App />);
  expect(queryAllByTestId('orders-resource')).toBeDefined();
});
