//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

import winston from "winston";
import * as ApplicationInsights from "applicationinsights";

export enum LogLevel {
  error = "error",
  warn = "warn",
  info = "info",
  http = "http",
  verbose = "verbose",
  debug = "debug",
  silly = "silly",
}

export class LogProvider {
  private logger: winston.Logger;
  private appInsightsClient: ApplicationInsights.TelemetryClient;

  private static _instance: LogProvider;

  private constructor() {
    this.logger = winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) => `[${info.timestamp}] : [${info.level}]: ${info.message}`
        )
      ),
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(new winston.transports.Console());
    }

    // setup application insights
    ApplicationInsights.setup()
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .start();

    this.appInsightsClient = ApplicationInsights.defaultClient;
    this.appInsightsClient.commonProperties = {
      environment: process.env.NODE_ENV,
    };

    this.appInsightsClient.flush({
      callback: (res) => {
        this.logger.log(LogLevel.info, "flush app insight test", res.toString());
      },
    });
  }

  public static get instance(): LogProvider {
    if (!this._instance) {
      this._instance = new LogProvider();
    }

    return this._instance;
  }

  public get telemetryClient(): ApplicationInsights.TelemetryClient {
    return this.appInsightsClient;
  }

  private log(level: LogLevel, ...message: string[]): void {
    if (process.env.NODE_ENV !== "test") {
      this.logger.log(level, message.join(" "));
    }

    if (process.env.NODE_ENV !== "local" && process.env.NODE_ENV !== "test") {
      this.appInsightsClient.trackEvent({
        name: level,
        properties: {
          message: message.join(" "),
        },
      });
    }
  }

  public info(...message: string[]) {
    this.log(LogLevel.info, ...message);
  }

  public warn(...message: string[]) {
    this.log(LogLevel.warn, ...message);
  }

  public debug(...message: string[]) {
    this.log(LogLevel.debug, ...message);
  }

  public http(...message: string[]) {
    this.log(LogLevel.http, ...message);
  }

  public verbose(...message: string[]) {
    this.log(LogLevel.verbose, ...message);
  }

  public silly(...message: string[]) {
    this.log(LogLevel.silly, ...message);
  }

  public error(...message: string[]) {
    this.log(LogLevel.error, ...message);
  }
}
