import { NestFactory } from '@nestjs/core';
import { ShoesService } from './shoes/shoes.service';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  await Promise.all([seedShoes(appContext)]);
  appContext.close();
}

async function seedShoes(appContext) {
  const shoesService = appContext.get(ShoesService);

  const seedPath = path.join(__dirname, '..', 'seeds', 'shoes.json');
  const rawShoes = JSON.parse(fs.readFileSync(seedPath).toString());

  console.log(`Seeding ${rawShoes.length} pairs...`);
  const result = await shoesService.createMany(rawShoes);
  console.log(`Seeded ${result.length} pairs!`);
}

seed();
