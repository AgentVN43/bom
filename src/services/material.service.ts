import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../entities/material.entity';
import { CreateMaterialDto } from '../dto/create-material.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    try {
      const material = this.materialRepository.create(createMaterialDto);
      return await this.materialRepository.save(material);
    } catch (error) {
      console.log('Error creating material:', error);
      throw new HttpException(
        'Failed to create material',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMany(
    createMaterialDtos: CreateMaterialDto[],
  ): Promise<Material[]> {
    try {
      const materials = createMaterialDtos.map((dto) =>
        this.materialRepository.create(dto),
      );
      console.log('Materials to save:', materials);
      return await this.materialRepository.save(materials);
    } catch (error) {
      console.log('Error creating materials:', error);
      throw new HttpException(
        'Failed to create materials',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<Material> {
    try {
      const material = await this.materialRepository.findOne({
        where: { material_id: id, delete_flag: false },
      });

      if (!material) {
        throw new HttpException('Material not found', HttpStatus.NOT_FOUND);
      }

      return material;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch material',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Material[]> {
    try {
      return await this.materialRepository.find({
        where: { delete_flag: false },
        relations: ['productDetails', 'inventories'],
      });
    } catch (error) {
      console.log('Error fetching materials:', error);
      throw new HttpException(
        'Failed to fetch materials',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
