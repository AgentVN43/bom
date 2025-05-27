import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ProductDetail } from './product-detail.entity';

@Entity('categories')
export class Category extends CommonEntity {
  /** Unique identifier for the category */
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  /** Name of the category */
  @Column({ length: 100 })
  category_name: string;

  /** Type of the category */
  @Column({ length: 50, nullable: true })
  type: string;

  /** Detailed description of the category */
  @Column({ type: 'text', nullable: true })
  description: string;

  /** Product details in this category */
  @OneToMany(() => ProductDetail, (productDetail) => productDetail.category)
  productDetails: ProductDetail[];
}
