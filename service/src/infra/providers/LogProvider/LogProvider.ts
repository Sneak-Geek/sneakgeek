//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

import winston from "winston";

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
  }

  public static get instance(): LogProvider {
    if (!this._instance) {
      this._instance = new LogProvider();
    }

    return this._instance;
  }

  private log(level: LogLevel, ...message: string[]): void {
    if (process.env.NODE_ENV !== "test") {
      this.logger.log(level, message.join(" "));
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
