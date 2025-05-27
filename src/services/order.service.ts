import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { delete_flag: false },
      relations: ['product'],
    });
  }

  async findOne(id: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { order_id: id, delete_flag: false },
      relations: ['product'],
    });
  }

  async create(order: Order): Promise<Order> {
    order.created_time = new Date();
    order.delete_flag = false;
    return await this.orderRepository.save(order);
  }

  async update(id: string, order: Order): Promise<Order | null> {
    const existingOrder = await this.findOne(id);
    if (!existingOrder) {
      throw new Error('Order not found');
    }
    order.updated_time = new Date();
    await this.orderRepository.update(id, order);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.delete_flag = true;
    order.updated_time = new Date();
    await this.orderRepository.save(order);
  }
}
