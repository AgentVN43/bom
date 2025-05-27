import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDetail } from '../entities/product-detail.entity';
import {
  CreateProductDetailDto,
  ComponentItemType,
} from '../dto/create-product-detail.dto'; // Import DTO và Enum
import { Material } from '../entities/material.entity'; // Import Material entity
import { Product } from '../entities/product.entity'; // Import Product entity

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Material) // Inject Material Repository
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Product) // Inject Product Repository
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<ProductDetail[]> {
    try {
      return await this.productDetailRepository.find({
        where: { delete_flag: false },
        relations: ['product', 'material', 'category'], // Giữ nguyên relations nếu bạn muốn tải dữ liệu liên quan
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new HttpException(
        'Failed to fetch product details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<ProductDetail | null> {
    try {
      return await this.productDetailRepository.findOne({
        where: { product_detail_id: id, delete_flag: false },
        relations: ['product', 'material', 'category'], // Giữ nguyên relations nếu bạn muốn tải dữ liệu liên quan
      });
    } catch (error) {
      console.error('Error fetching product detail:', error);
      throw new HttpException(
        'Failed to fetch product detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createProductDetailDto: CreateProductDetailDto,
  ): Promise<ProductDetail> {
    try {
      // Validate product_id (parent_product_id) exists in products table
      const parentProduct = await this.productRepository.findOne({
        where: {
          product_id: createProductDetailDto.product_id,
          delete_flag: false,
        },
      });
      if (!parentProduct) {
        throw new HttpException(
          'Parent product not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate component_item_id based on component_item_type
      let componentExists = false;
      if (
        createProductDetailDto.component_item_type ===
        ComponentItemType.MATERIAL
      ) {
        const material = await this.materialRepository.findOne({
          where: {
            material_id: createProductDetailDto.material_id,
            delete_flag: false,
          },
        });
        if (material) {
          componentExists = true;
        }
      } else if (
        createProductDetailDto.component_item_type === ComponentItemType.PRODUCT
      ) {
        const product = await this.productRepository.findOne({
          where: {
            product_id: createProductDetailDto.material_id,
            delete_flag: false,
          }, // material_id trong DTO sẽ chứa product_id của bán thành phẩm
        });
        if (product) {
          componentExists = true;
        }
      }

      if (!componentExists) {
        throw new HttpException(
          'Component item not found or invalid type',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create a new ProductDetail entity instance
      const productDetail = this.productDetailRepository.create({
        product_id: createProductDetailDto.product_id,
        material_id: createProductDetailDto.material_id, // material_id sẽ lưu ID của component (material_id hoặc product_id)
        material_quantity: createProductDetailDto.material_quantity,
        category_id: createProductDetailDto.category_id, // category_id của BOM
        // total_price sẽ được tính toán ở đây hoặc trong một hook/listener nếu cần
        created_user: createProductDetailDto.created_user,
        updated_user: createProductDetailDto.updated_user,
      });

      // Gán các trường CommonEntity nếu chưa được xử lý tự động
      productDetail.created_time = new Date();
      productDetail.delete_flag = false;

      return await this.productDetailRepository.save(productDetail);
    } catch (error) {
      console.error('Error creating product detail:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create product detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateProductDetailDto: CreateProductDetailDto,
  ): Promise<ProductDetail | null> {
    try {
      const existingProductDetail = await this.findOne(id);
      if (!existingProductDetail) {
        throw new HttpException(
          'Product detail not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Validate parent product and component item existence (similar to create)
      const parentProduct = await this.productRepository.findOne({
        where: {
          product_id: updateProductDetailDto.product_id,
          delete_flag: false,
        },
      });
      if (!parentProduct) {
        throw new HttpException(
          'Parent product not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      let componentExists = false;
      if (
        updateProductDetailDto.component_item_type ===
        ComponentItemType.MATERIAL
      ) {
        const material = await this.materialRepository.findOne({
          where: {
            material_id: updateProductDetailDto.material_id,
            delete_flag: false,
          },
        });
        if (material) {
          componentExists = true;
        }
      } else if (
        updateProductDetailDto.component_item_type === ComponentItemType.PRODUCT
      ) {
        const product = await this.productRepository.findOne({
          where: {
            product_id: updateProductDetailDto.material_id,
            delete_flag: false,
          },
        });
        if (product) {
          componentExists = true;
        }
      }

      if (!componentExists) {
        throw new HttpException(
          'Component item not found or invalid type',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cập nhật các thuộc tính từ DTO vào entity hiện có
      existingProductDetail.product_id = updateProductDetailDto.product_id;
      existingProductDetail.material_id = updateProductDetailDto.material_id;
      existingProductDetail.material_quantity =
        updateProductDetailDto.material_quantity;
      existingProductDetail.category_id = updateProductDetailDto.category_id;
      // existingProductDetail.total_price = ... (tính toán lại nếu cần)
      if (updateProductDetailDto.updated_user !== undefined) {
        existingProductDetail.updated_user =
          updateProductDetailDto.updated_user;
      }
      existingProductDetail.updated_time = new Date();

      await this.productDetailRepository.save(existingProductDetail);
      return await this.findOne(id); // Trả về entity đã cập nhật
    } catch (error) {
      console.error('Error updating product detail:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update product detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const productDetail = await this.findOne(id);
      if (!productDetail) {
        throw new HttpException(
          'Product detail not found',
          HttpStatus.NOT_FOUND,
        );
      }
      productDetail.delete_flag = true;
      productDetail.updated_time = new Date();
      await this.productDetailRepository.save(productDetail);
    } catch (error) {
      console.error('Error removing product detail:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to remove product detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
