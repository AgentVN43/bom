import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { Material } from '../entities/material.entity';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { ProductDetailService } from '../services/product-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductDetail, Material])],
  controllers: [ProductController],
  providers: [ProductService, ProductDetailService],
  exports: [ProductService, ProductDetailService],
})
export class ProductModule {}
