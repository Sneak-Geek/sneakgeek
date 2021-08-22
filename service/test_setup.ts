//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import "reflect-metadata";
import path from "path";
import { EnvironmentProvider } from "./src/infra/providers";

jest.setTimeout(30000);

EnvironmentProvider.loadEnvironment(
  path.join(__dirname, "resources/environment/.env.test")
);
