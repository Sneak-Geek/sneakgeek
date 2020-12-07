//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Container } from "inversify";

class Factory {
  private _container: Container;
  private static _instance: Factory;

  private constructor() {
    this._container = new Container();
  }

  public static get instance(): Factory {
    if (!this._instance) {
      this._instance = new Factory();
    }

    return this._instance;
  }

  public register<T>(key: symbol, implementation: T) {
    if (this._container.isBound(key)) {
      this._container.unbind(key);
    }

    this._container.bind<T>(key).toConstantValue(implementation);
  }

  public getObjectInstance<T>(key: symbol): T {
    return this._container.get<T>(key);
  }
}

export const ObjectFactory = Factory.instance;
