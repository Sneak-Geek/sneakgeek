import mongoose from "mongoose";
import { LogProvider, TelemetryNamespace } from "../providers";

export type DbClient = mongoose.Mongoose;

export const getDbClient = async (connectionString: string) => {
  try {
    const startTime = Date.now();

    mongoose.connection.on("error", (e) => {
      LogProvider.instance.error("DB connection initialization error", JSON.stringify(e));

      LogProvider.instance.telemetryClient.trackMetric({
        name: TelemetryNamespace.DbFailedTime,
        value: Date.now() - startTime,
      });

      LogProvider.instance.telemetryClient.trackException({
        exception: {
          name: TelemetryNamespace.DbFailedExpcetion,
          message: "Mongo connection error",
          stack: e,
        },
      });
    });

    mongoose.connection.on("open", () => {
      LogProvider.instance.info(`DB connection to ${connectionString} open successfully`);

      LogProvider.instance.telemetryClient.trackMetric({
        name: TelemetryNamespace.DbBootTime,
        value: Date.now() - startTime,
      });
    });

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      autoIndex: false,
    });

    return mongoose;
  } catch (error) {
    throw new Error(error);
  }
};
