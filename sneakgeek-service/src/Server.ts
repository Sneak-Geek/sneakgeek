// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import bodyParser from "body-parser";
import * as express from "express";
import cors from "cors";
import http from "http";
import HttpStatus from "http-status";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import morgan from "morgan";
import passport from "passport";
import * as Constants from "./assets/constants";
import { container, asyncBindings, Types } from "./configuration/inversify";
import {
  IBootstrapProvider,
  ISearchProvider,
  LogProvider,
  TelemetryNamespace,
} from "./infra/providers";
import path from "path";
import { DbClient } from "./infra/database";

export default class Server {
  private static _appInstance: express.Application;
  private static _isServerReady: boolean = false;
  private static _port: number = parseInt(process.env.PORT, 10) || 8080;
  private static _httpServer: http.Server;
  private static _startTime = Date.now();

  public static get instance(): express.Application {
    return this._appInstance;
  }

  public static get isServerReady(): boolean {
    return this._isServerReady;
  }

  public static get container(): Container {
    return container;
  }

  public static exit(): void {
    if (this._httpServer) {
      this._httpServer.close();
      container.get<DbClient>(Types.DbClient).connection.close();
    }
  }

  public static async buildAppContainerAsync(): Promise<express.Application> {
    LogProvider.instance.info("Loading application dependencies");

    try {
      await this.container.loadAsync(asyncBindings);
    } catch (error) {
      LogProvider.instance.error(`Error loading dependencies ${error}`);
    }

    LogProvider.instance.info("Creating application container");

    const inversifyAppContainer = new InversifyExpressServer(this.container);
    inversifyAppContainer.setConfig(this._setupAppConfig.bind(this));
    inversifyAppContainer.setErrorConfig(this._setupErrorConfig.bind(this));
    this._appInstance = inversifyAppContainer.build();

    LogProvider.instance.info("Dependencies load successfully");

    return this._appInstance;
  }

  public static async dropDatabase() {
    if (process.env.NODE_ENV !== "test") {
      throw new Error("WARNING: CANNOT DROP DATABASE ON PROD");
    }

    try {
      await this.container.get<DbClient>(Types.DbClient).connection.db.dropDatabase();
    } catch (error) {
      LogProvider.instance.warn("Cannot drop database");
    }
  }

  public static async initAppAsync(): Promise<express.Application> {
    if (!this._appInstance || !this._httpServer) {
      LogProvider.instance.info("Initializing application");
      this._appInstance = await this.buildAppContainerAsync();

      // Bootstrapping user data
      await this._bootstrapSeededDataAsync();

      try {
        // Index data
        await this._initializeIndex();
      } catch (error) {
        LogProvider.instance.error(
          "[ElasticSearch] Error initializing ElasticSearch service",
          JSON.stringify(error, null, 2)
        );
      }
    }

    return this._appInstance;
  }

  public static start(): void {
    LogProvider.instance.info("Starting application");

    this._httpServer = this._appInstance.listen(this._port, () => {
      this._isServerReady = true;
      if (process.env.NODE_ENV !== "test") {
        const serverBootedTime = Date.now();
        LogProvider.instance.info(
          `Listening on port: ${this._port}, duration: ${
            serverBootedTime - this._startTime
          }`
        );

        LogProvider.instance.telemetryClient.trackMetric({
          name: TelemetryNamespace.ServerBootTime,
          value: serverBootedTime - this._startTime,
        });
      }
    });
  }

  private static async _bootstrapSeededDataAsync(): Promise<any> {
    const bootstrapProvider = this.container.get<IBootstrapProvider>(
      Types.BootstrapProvider
    );
    LogProvider.instance.info("Bootstrapping data");

    await bootstrapProvider.bootstrapUsersData();
    await bootstrapProvider.bootstrapShoesData();
    await bootstrapProvider.bootstrapCatalogData();

    // bootstrap GHN shipping data
    await bootstrapProvider.bootstrapShippingService();

    LogProvider.instance.info("Bootstrap data completed");
  }

  private static async _initializeIndex(): Promise<void> {
    LogProvider.instance.info("Initializing search index");

    const searchProvider = this.container.get<ISearchProvider>(Types.SearchProvider);
    const bootstrapProvider: IBootstrapProvider = this.container.get<IBootstrapProvider>(
      Types.BootstrapProvider
    );

    await searchProvider.initialize();
    const isPopulated = await searchProvider.isPopulated();
    if (!isPopulated) {
      await searchProvider.indexShoes(bootstrapProvider.getRawShoesData());
    }
    LogProvider.instance.info("ElasticSearch index initialized and populated");
  }

  private static _setupAppConfig(app: express.Application) {
    LogProvider.instance.info("Configuring application settings");

    // Cors. TODO: configure safe options for access from trusted website only
    app.use(cors());

    // Request logging
    app.use(
      morgan("combined", {
        stream: {
          write: (message: string) => {
            LogProvider.instance.info(message);
          },
        },
      })
    );

    // Configure requests body parsing
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(passport.initialize());

    // setup view engine
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    LogProvider.instance.info("Application settings configured");
  }

  private static _setupErrorConfig(app: express.Application) {
    app.use(
      (
        error: any,
        _request: express.Request,
        response: express.Response,
        _next: express.NextFunction
      ) => {
        if (error.name === Constants.Errors.InternalOAuthError) {
          return response.status(HttpStatus.UNAUTHORIZED).send({
            message: "Unauthorized",
          });
        }

        LogProvider.instance.error(`HTTP request default error handler\n${error.stack}`);

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: "Internal server errror.",
        });
      }
    );
  }
}
