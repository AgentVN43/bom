import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Bún bò Huế đặc biệt', // Ví dụ cho tên sản phẩm
    minLength: 1, // Có thể thêm validation tương tự material DTO
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @ApiProperty({
    required: false,
    description: 'Price of the product',
    example: 80000.0, // Ví dụ cho giá sản phẩm
  })
  @IsOptional()
  @IsNumber()
  product_price?: number;

  @ApiProperty({
    required: false,
    description: 'Version of the product',
    example: '1.0', // Ví dụ cho phiên bản
    maxLength: 20, // Có thể thêm validation
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({
    required: false,
    description: 'Detailed description of the product',
    example:
      'Món bún bò truyền thống của Huế với nước dùng đậm đà, thịt bò thái mỏng và chả cua.', // Ví dụ cho mô tả
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'User who created the product record',
    example: 'admin_user_id', // Ví dụ cho người tạo
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  created_user?: string;

  @ApiProperty({
    required: false,
    description: 'User who last updated the product record',
    example: 'editor_user_id', // Ví dụ cho người cập nhật
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  updated_user?: string;
}
