import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users.module';
import { MaterialModule } from './modules/material.module';
import { CategoryModule } from './modules/category.module';
import { InventoryModule } from './modules/inventory.module';
import { ProductModule } from './modules/product.module';
import { OrderModule } from './modules/order.module';
import { ProductDetailModule } from './modules/product-detail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    MaterialModule,
    CategoryModule,
    InventoryModule,
    ProductModule,
    OrderModule,
    ProductDetailModule,
  ],
})
export class AppModule {}
