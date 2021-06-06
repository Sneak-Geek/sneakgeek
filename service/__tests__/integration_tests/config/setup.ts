import "reflect-metadata";
import path from "path";
import { EnvironmentProvider } from "../../../src/infra/providers";

EnvironmentProvider.loadEnvironment(
  path.join(process.cwd(), "__tests__", "integration_tests", "config", ".env")
);
