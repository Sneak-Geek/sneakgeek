import fs from "fs";
import dotenv from "dotenv";
import validator from "validator";
import { injectable } from "inversify";

export class Environment {
  Port: number;
  Host: string;
  MongoUrl: string;
  FbClientId: string;
  FbClientSecret: string;
  GoogleClientId: string;
  GoogleClientSecret: string;
  JwtSecret: string;
  JwtMaxAge: number;
  MailgunApiKey: string;
  AzStorageAccount: string;
  AzStorageAccessKey: string;
  AzStorageArticleFolder: string;
  AzStorageUserImg: string;
  AzStorageShoeImgFolder: string;
  AzStorageOrderImgFolder: string;
  AzExpireSasHour: number;
  GhnAccessToken: string;
  GhnClientToken: string;
  GhnBaseUrl: string;
  GhnEmail: string;
  GhnPassword: string;
  ExternalServiceTimeout: number;
  IsElasticCloud: boolean;
  ElasticSearchEndpoint: string;
  AppInsightsKey: string;
  AzNotificationSasKeyName: string;
  AzNotificationSasKeyValue: string;
  AzNotificationHubNamespace: string;
  AzNotificationHubName: string;
  AppleBundleId: string;
  AppleTeamId: string;
  AppleKeyId: string;
  SnkgSupportDomain: string;
}

export class EnvironmentProvider {
  private static _environment: Environment = new Environment();

  public static loadEnvironment(envPath?: string) {
    const isPathExists = envPath && fs.existsSync(envPath);
    if (isPathExists) {
      dotenv.config({ path: envPath });
    }

    this._checkEnvironmentForLoading();
  }

  public static get env(): Environment {
    return this._environment;
  }

  // TODO: Better validator for:
  // - mongo url
  // - google client id
  // - mailgun api key

  // prettier-ignore
  private static _checkEnvironmentForLoading() {
    this._checkAndSetEnv<number>("PORT", "Port", validator.isNumeric, parseInt);
    this._checkAndSetEnv<string>("HOST", "Host", validator.isURL);
    this._checkAndSetEnv<string>("MONGO_URL", "MongoUrl", validator.isAscii);
    this._checkAndSetEnv<string>("FB_CLIENT_ID", "FbClientId", validator.isAlphanumeric);
    this._checkAndSetEnv<string>("FB_CLIENT_SECRET", "FbClientSecret", validator.isAlphanumeric);
    this._checkAndSetEnv<string>("GOOGLE_CLIENT_ID", "GoogleClientId", validator.isAscii);
    this._checkAndSetEnv("JWT_SECRET", "JwtSecret", validator.isAlphanumeric);
    this._checkAndSetEnv<number>("JWT_MAX_AGE", "JwtMaxAge", validator.isNumeric, parseInt);
    this._checkAndSetEnv("MAILGUN_API_KEY", "MailgunApiKey", validator.isAscii);
    this._checkAndSetEnv("SNKG_SUPPORT_DOMAIN", "SnkgSupportDomain", validator.isAscii);
    this._checkAndSetEnv("AZURE_STORAGE_ACCOUNT", "AzStorageAccount", validator.isAlpha);
    this._checkAndSetEnv("AZURE_STORAGE_ACCESS_KEY", "AzStorageAccessKey", validator.isAscii);
    this._checkAndSetEnv("AZURE_STORAGE_ARTICLE_FOLDER", "AzStorageArticleFolder", validator.isAlpha);
    this._checkAndSetEnv("AZURE_STORAGE_USER_IMG_FOLDER", "AzStorageUserImg", validator.isAlpha);
    this._checkAndSetEnv("AZURE_STORAGE_SHOE_IMG_FOLDER", "AzStorageShoeImgFolder", validator.isAscii);
    this._checkAndSetEnv("AZURE_STORAGE_ORDER_IMG_FOLDER", "AzStorageOrderImgFolder", validator.isAlpha);
    this._checkAndSetEnv<number>("AZURE_EXPIRE_SAS_HOUR", "AzExpireSasHour", validator.isNumeric, parseInt);
    this._checkAndSetEnv("GHN_ACCESS_TOKEN", "GhnAccessToken", validator.isAlpha);
    this._checkAndSetEnv("GHN_CLIENT_TOKEN", "GhnClientToken", validator.isAlpha);
    this._checkAndSetEnv("GHN_EMAIL", "GhnEmail", validator.isEmail);
    this._checkAndSetEnv("GHN_PASSWORD", "GhnPassword", validator.isAscii);
    this._checkAndSetEnv("GHN_BASE_URL", "GhnBaseUrl", validator.isURL);
    this._checkAndSetEnv<number>("EXTERNAL_SERVICE_TIMEOUT_MINUTE", "ExternalServiceTimeout", validator.isNumeric, parseInt);
    this._checkAndSetEnv<boolean>("ELASTIC_CLOUD", "IsElasticCloud", validator.isBoolean, JSON.parse);    
    this._checkAndSetEnv("ELASTIC_SEARCH_ENDPOINT", "ElasticSearchEndpoint", validator.isAscii);    
    this._checkAndSetEnv("APPINSIGHTS_INSTRUMENTATIONKEY", "AppInsightsKey", validator.isAscii);
    this._checkAndSetEnv("AZURE_NOTIFICATION_SAS_KEY_NAME", "AzNotificationSasKeyName", validator.isAlpha);
    this._checkAndSetEnv("AZURE_NOTIFICATION_SAS_KEY_VALUE", "AzNotificationSasKeyValue", validator.isAscii);
    this._checkAndSetEnv("AZURE_NOTIFICATION_HUB_NS", "AzNotificationHubNamespace", validator.isAscii);
    this._checkAndSetEnv("AZURE_NOTIFICATION_HUB_NAME", "AzNotificationHubName", validator.isAscii);
    this._checkAndSetEnv("APPLE_BUNDLE_IDENTIFIER", "AppleBundleId", validator.isAscii);
    this._checkAndSetEnv("APPLE_TEAM_ID", "AppleTeamId", validator.isAlphanumeric);
    this._checkAndSetEnv("APPLE_KEY_IDENTIFIER", "AppleKeyId", validator.isAlphanumeric);
  }

  private static _checkAndSetEnv<T>(
    rawEnvKey: string,
    envKey: string,
    checker: (envValue: T | string) => boolean,
    parser?: (envValue: string) => T
  ) {
    if (checker(process.env[rawEnvKey])) {
      const value: string = process.env[rawEnvKey];
      this._environment[envKey] = parser ? parser(value) : value;
    } else {
      throw new Error(`Environment is missing ${rawEnvKey}`);
    }
  }
}