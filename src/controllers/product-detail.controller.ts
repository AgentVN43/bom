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
import { ProductDetailService } from '../services/product-detail.service';
import { ProductDetail } from '../entities/product-detail.entity';
import { CreateProductDetailDto } from '../dto/create-product-detail.dto'; // Import DTO
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger'; // Import Swagger decorators

@Controller('product-details')
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product details (BOM entries)' })
  @ApiResponse({
    status: 200,
    description: 'Return all product detail entries.',
    type: [ProductDetail],
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<ProductDetail[]> {
    try {
      return await this.productDetailService.findAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product detail (BOM entry) by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single product detail entry.',
    type: ProductDetail,
  })
  @ApiResponse({ status: 404, description: 'Product detail not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: string): Promise<ProductDetail> {
    try {
      const productDetail = await this.productDetailService.findOne(id);
      if (!productDetail) {
        throw new HttpException('Product detail not found', HttpStatus.NOT_FOUND);
      }
      return productDetail;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product detail (BOM entry)' })
  @ApiBody({
    type: CreateProductDetailDto,
    description: 'JSON body for creating a new product detail entry',
  })
  @ApiCreatedResponse({
    description: 'The product detail entry has been successfully created.',
    type: ProductDetail,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to create product detail entry.',
  })
  async create(
    @Body() createProductDetailDto: CreateProductDetailDto,
  ): Promise<ProductDetail> {
    try {
      return await this.productDetailService.create(createProductDetailDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product detail (BOM entry)' })
  @ApiBody({
    type: CreateProductDetailDto,
    description: 'JSON body for updating a product detail entry',
  })
  @ApiResponse({
    status: 200,
    description: 'The product detail entry has been successfully updated.',
    type: ProductDetail,
  })
  @ApiResponse({ status: 404, description: 'Product detail not found.' })
  @ApiResponse({
    status: 500,
    description: 'Failed to update product detail entry.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDetailDto: CreateProductDetailDto, // <-- Đảm bảo kiểu dữ liệu là CreateProductDetailDto
  ): Promise<ProductDetail> {
    try {
      // Gọi service với DTO, không cần ép kiểu
      const result = await this.productDetailService.update(
        id,
        updateProductDetailDto,
      );
      if (!result) {
        throw new HttpException(
          'Product detail not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product detail (BOM entry) by ID (soft delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'The product detail entry has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product detail not found.' })
  @ApiResponse({
    status: 500,
    description: 'Failed to delete product detail entry.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.productDetailService.remove(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
