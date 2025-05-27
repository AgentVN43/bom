import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { delete_flag: false },
      relations: ['details', 'orders'],
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { product_id: id, delete_flag: false },
      relations: ['details', 'orders'],
    });
  }

  async create(product: Product): Promise<Product> {
    product.created_time = new Date();
    product.delete_flag = false;
    return await this.productRepository.save(product);
  }

  async update(id: string, product: Product): Promise<Product | null> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    product.updated_time = new Date();
    await this.productRepository.update(id, product);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.delete_flag = true;
    product.updated_time = new Date();
    await this.productRepository.save(product);
  }
}
