import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto'; // Import your DTO
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger'; // Import Swagger decorators

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: [Product],
  })
  async findAll(): Promise<Product[]> {
    try {
      return await this.productService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single product.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id') id: string): Promise<Product> {
    try {
      const product = await this.productService.findOne(id);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    description: 'JSON body for creating a new product',
  }) // <-- Thêm dòng này
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 500, description: 'Failed to create product.' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    // <-- Thay đổi kiểu dữ liệu ở đây
    try {
      // Đảm bảo ProductService.create nhận CreateProductDto và xử lý đúng
      // Bạn có thể cần ánh xạ DTO sang Entity trong service nếu cần
      return await this.productService.create(createProductDto as Product); // Ép kiểu tạm thời nếu service vẫn mong đợi Product
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiBody({
    type: CreateProductDto,
    description: 'JSON body for updating a product',
  }) // <-- Thêm dòng này
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 500, description: 'Failed to update product.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto, // <-- Thay đổi kiểu dữ liệu ở đây
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productService.update(
        id,
        updateProductDto as Product,
      ); // Ép kiểu tạm thời
      if (!updatedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return updatedProduct;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 500, description: 'Failed to delete product.' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.productService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
