import { Module } from '@nestjs/common';
import { ShoesModule } from './shoes/shoes.module';
import { ProfileModule } from './profile/profile.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { InventoryModule } from './inventory/inventory.module';
import { SearchModule } from './search/search.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL'),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    ShoesModule,
    ProfileModule,
    OrderModule,
    InventoryModule,
    SearchModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
