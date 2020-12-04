import { ConfigService } from '@nestjs/config/dist/config.service';
import { NestFactory } from '@nestjs/core';
import admin from 'firebase-admin';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  // Initializing firebase app
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: configService.get('FIREBASE_DB_URL'),
  });

  await app.listen(3000);
}
bootstrap();
