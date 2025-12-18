import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';

// Enum để định nghĩa rõ các loại component_item_type
export enum ComponentItemType {
  MATERIAL = 'MATERIAL',
  PRODUCT = 'PRODUCT',
}

export class CreateProductDetailDto {
  @ApiProperty({
    description:
      'ID of the parent product (finished product or intermediate product)',
    example: 'prod_bunbo', // Ví dụ: ID của Bún bò Huế
  })
  @IsNotEmpty()
  @IsUUID()
  product_id: string; // Tên trường theo controller của bạn

  @ApiProperty({
    description: 'ID of the component item (material or product)',
    example: 'mat_bun', // Ví dụ: ID của Bún tươi (material) hoặc prod_nuocxuong (product)
  })
  @IsNotEmpty()
  @IsString() // Có thể là UUID của material hoặc product
  material_id: string; // Tên trường trong DTO khớp với cột trong DB

  @ApiProperty({
    description: 'Type of the component item (material or product)',
    enum: ComponentItemType,
    example: ComponentItemType.MATERIAL, // Ví dụ: 'material' hoặc 'product'
  })
  @IsNotEmpty()
  @IsEnum(ComponentItemType)
  component_item_type: ComponentItemType; // Trường này chỉ có trong DTO, không có trong DB

  @ApiProperty({
    description: 'Quantity required for this component in the parent product',
    example: 150, // Example changed to INT to match DB schema
  })
  @IsNotEmpty()
  @IsNumber()
  material_quantity: number; // Keep as number, validation will handle INT

  @ApiProperty({
    description:
      'Category ID of this BOM entry (e.g., BOM Thành phẩm, BOM Bán thành phẩm)',
    example: 'cat_bom_fin', // Ví dụ: ID của category 'BOM Thành phẩm'
    required: false, // Keep as optional as per your schema
  })
  @IsOptional() // Keep as optional as per your schema
  @IsUUID()
  category_id: string; // Keep as optional as per your schema

  @ApiProperty({
    required: false,
    description: 'User who created this product detail record',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  created_user?: string;

  @ApiProperty({
    required: false,
    description: 'User who last updated this product detail record',
    example: 'editor',
  })
  @IsOptional()
  @IsString()
  updated_user?: string;
}
