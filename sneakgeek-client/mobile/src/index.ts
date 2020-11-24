//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

// Needed for InversifyJS
import "reflect-metadata";
import { container } from "./Config/Inversify";

console.log(container);

import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("client", () => App);
