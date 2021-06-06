import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './screens/App';
import * as serviceWorker from './serviceWorker';
import {
  ObjectFactory as Kernel,
  IEnvVar,
  FactoryKeys as Keys,
  IAccountService,
  AccountService,
  ICatalogService,
  CatalogService,
  ISettingsProvider,
  IShoeService,
  ShoeService,
} from 'business';
import { SettingsProvider } from './core';

Kernel.register<IEnvVar>(Keys.IEnvVar, {
  dev: process.env.NODE_ENV !== 'production',
  devUrl: 'http://localhost:8080/api/v1',
});
Kernel.register<IAccountService>(Keys.IAccountService, new AccountService());
Kernel.register<ICatalogService>(Keys.ICatalogService, new CatalogService());
Kernel.register<ISettingsProvider>(Keys.ISettingsProvider, new SettingsProvider());
Kernel.register<IShoeService>(Keys.IShoeService, new ShoeService());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
