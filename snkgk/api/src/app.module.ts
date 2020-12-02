import { Module } from '@nestjs/common';
import { ShoesModule } from './shoes/shoes.module';
import { ProfileModule } from './profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { SearchModule } from './search/search.module';
import { AuthModule } from './auth/auth.module';
import { InventoriesModule } from './inventories/inventories.module';
import { OrdersModule } from './orders/orders.module';

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
    InventoriesModule,
    SearchModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
