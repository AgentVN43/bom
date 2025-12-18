// src/dto/flattened-bom-line.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class FlattenedBomLineDto {
  @ApiProperty()
  material_id: string;

  @ApiProperty()
  material_name: string;

  @ApiProperty({ required: false, nullable: true })
  unit: string | null;

  @ApiProperty({
    description: 'Số lượng material cần cho qty portion',
    example: 50,
  })
  quantity: number;
}
