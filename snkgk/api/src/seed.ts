import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplicationContext } from '@nestjs/common';
import { SearchService } from './search/search.service';
import { exec } from 'child_process';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { ShoesService } from './shoes/shoes.service';
import { ShoesDocument } from './shoes/shoes.schema';

const seedPath = path.join(__dirname, '..', 'seeds', 'shoes.json');

async function seed() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log'],
  });

  await Promise.all([
    // seedShoes(appContext),
    initializeAndIndexShoes(appContext),
  ]);
  appContext.close();
}

function seedShoes(appContext: INestApplicationContext) {
  const configService = appContext.get(ConfigService);
  return new Promise<void>((resolve, reject) => {
    const mongoUrl = configService.get('MONGO_URL');
    exec(
      `mongoimport ${seedPath} --uri ${mongoUrl} -d snkgk -c shoes --jsonArray --drop`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(stderr);
          reject(err);
        } else {
          console.log(stdout);
          resolve();
        }
      },
    );
  });
}

async function initializeAndIndexShoes(appContext: INestApplicationContext) {
  const searchService = appContext.get(SearchService);
  const shoeService = appContext.get(ShoesService);

  console.log(`Preparing cursor for indexing`);

  const shoes: Array<ShoesDocument> = [];
  const cursor = await shoeService.getAllByCursor();
  await cursor.eachAsync((s) => shoes.push(s));

  console.log(`Indexing ${shoes.length} pairs...`);

  // Uncomment if need to drop index
  await searchService.drop();

  await searchService.initialize();
  await searchService.indexShoes(shoes.map((shoe) => shoe.toObject()));
  const count = await searchService.getCount();
  console.log(`Indexed ${count} pairs!`);

  cursor.close();
}

seed().catch((e) => console.error(e));
