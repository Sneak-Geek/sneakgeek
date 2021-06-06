//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { IAppState } from "./IAppState";
import { Store } from "redux";

export interface IStoreProvider {
  getStore: () => Store<IAppState>;
}
