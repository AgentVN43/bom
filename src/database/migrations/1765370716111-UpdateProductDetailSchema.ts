import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductDetailSchema1765370716111
  implements MigrationInterface
{
  name = 'UpdateProductDetailSchema1765370716111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ✅ Migration này được giữ lại chỉ để đánh dấu là đã xử lý schema BOM.
    // Schema thực tế (component_item_type + material_quantity decimal)
    // đã được cập nhật MANUAL bằng SQL:
    //
    //   ALTER TABLE product_detail
    //   ADD COLUMN component_item_type varchar(20) NOT NULL DEFAULT 'MATERIAL';
    //
    //   ALTER TABLE product_detail
    //   MODIFY COLUMN material_quantity decimal(20,4) NOT NULL;
    //
    // Nên ở đây KHÔNG thực hiện thêm query nào nữa để tránh lỗi/đụng data.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ❗ Nếu muốn, bạn có thể revert thủ công 2 thay đổi trên,
    // nhưng hiện tại không khuyến khích revert trong môi trường dev này.
    //
    // Ví dụ (CHỈ THAM KHẢO, đừng dùng khi không cần):
    // await queryRunner.query(`
    //   ALTER TABLE product_detail
    //   MODIFY COLUMN material_quantity int NOT NULL
    // `);
    // await queryRunner.query(`
    //   ALTER TABLE product_detail
    //   DROP COLUMN component_item_type
    // `);
  }
}
