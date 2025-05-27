import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { Product } from './product.entity';
import { Material } from './material.entity';
import { Category } from './category.entity'; // Import Category entity

@Entity('product_detail')
export class ProductDetail extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  product_detail_id: string;

  @Column({ type: 'varchar', length: 36 })
  product_id: string; // FK to products.product_id

  @Column({ type: 'varchar', length: 36 })
  material_id: string; // This column will store ID from either materials or products

  // NEW: This field is NOT in the database, but we add it to the entity
  // to help with TypeORM's mapping and application logic.
  // It will be transient or handled manually in service.
  // @Column({ type: 'varchar', length: 50, nullable: false })
  // component_item_type: string; // This column is NOT in your DB schema.

  @Column({ type: 'int' }) // Keep as INT based on your provided schema
  material_quantity: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  total_price: number;

  @Column({ type: 'varchar', length: 36, nullable: true }) // Keep nullable: true as per your schema
  category_id: string; // FK to categories.category_id

  // Relationships (TypeORM will try to map these based on column names,
  // but the polymorphic nature of material_id needs manual handling in service)
  @ManyToOne(() => Product, (product) => product.details)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // This relationship can only be to Material. If material_id stores a Product ID,
  // TypeORM will not be able to load it directly through this relation.
  @ManyToOne(() => Material, (material) => material.productDetails)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => Category, (category) => category.productDetails)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
