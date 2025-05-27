import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetail } from '../entities/product-detail.entity';
import { ProductDetailController } from '../controllers/product-detail.controller';
import { ProductDetailService } from '../services/product-detail.service';
import { Material } from '../entities/material.entity'; // Import Material entity
import { Product } from '../entities/product.entity'; // Import Product entity
import { Category } from '../entities/category.entity'; // Import Category entity

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDetail, Material, Product, Category]), // Thêm Material, Product, Category vào forFeature
  ],
  controllers: [ProductDetailController],
  providers: [ProductDetailService],
  exports: [ProductDetailService],
})
export class ProductDetailModule {}
