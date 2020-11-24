// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import "reflect-metadata";
import path from "path";
import Server from "./src/Server";
import { LogProvider } from "./src/infra/providers/LogProvider";
import { EnvironmentProvider } from "./src/infra/providers";

let envFile = "";

switch (process.env.NODE_ENV) {
  case "dev":
    envFile = ".env.dev";
    break;
  case "test":
    envFile = ".env.test";
    break;
  case "prod":
    envFile = ".env.prod";
    break;
  case "local":
  default:
    envFile = ".env.local";
    break;
}

const envFilePath = path.resolve(process.cwd(), "resources", "environment", envFile);

try {
  EnvironmentProvider.loadEnvironment(envFilePath);
  LogProvider.instance.info(`Load environment success at ${envFilePath}`);
} catch (error) {
  LogProvider.instance.error("Error loading environment", error);
  process.exit(1);
}

Server.initAppAsync()
  .then(() => {
    Server.start();
  })
  .catch((error) => {
    LogProvider.instance.error("Error starting server", error.stack);
    process.exit(1);
  });
