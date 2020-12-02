import { NestFactory } from '@nestjs/core';
import { ShoesService } from './shoes/shoes.service';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { SearchService } from './search/search.service';

const seedPath = path.join(__dirname, '..', 'seeds', 'shoes.json');
const rawShoes = JSON.parse(fs.readFileSync(seedPath).toString());

async function seed() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log'],
  });

  await Promise.all([
    seedShoes(appContext),
    initializeAndIndexShoes(appContext),
  ]);
  appContext.close();
}

async function seedShoes(appContext: INestApplicationContext) {
  const shoesService = appContext.get(ShoesService);

  console.log(`Seeding ${rawShoes.length} pairs...`);
  const result = await shoesService.createMany(rawShoes);
  console.log(`Seeded ${result.length} pairs!`);
}

async function initializeAndIndexShoes(appContext: INestApplicationContext) {
  console.log(`Indexing shoes...`);
  const searchService = appContext.get(SearchService);

  // Uncomment if need to drop index
  // await searchService.drop();

  await searchService.initialize();
  await searchService.indexShoes(
    rawShoes.map((shoe) => ({
      _id: shoe._id['$oid'],
      brand: shoe.brand,
      category: shoe.category,
      colorway: shoe.colorway,
      description: shoe.description,
      gender: shoe.gender,
      releaseDate: new Date(shoe.releaseDate['$date']),
      name: shoe.name,
      styleId: shoe.styleId,
      imageUrl: shoe.imageUrl?.trim(),
      title: shoe.title,
    })),
  );
  const count = await searchService.getCount();
  console.log(`Indexed ${count} pairs!`);
}

seed().catch((e) => console.error(e));
