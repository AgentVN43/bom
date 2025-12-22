import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDetail } from '../entities/product-detail.entity';
import {
  CreateProductDetailDto,
  ComponentItemType,
} from '../dto/create-product-detail.dto'; // Import DTO và Enum
import { Material } from '../entities/material.entity'; // Import Material entity
import { Product } from '../entities/product.entity'; // Import Product entity

export interface FlattenedBomLine {
  material_id: string;
  material_name: string;
  unit: string;
  quantity: number;
}

// @Injectable()
// export class ProductDetailService {
//   constructor(
//     @InjectRepository(ProductDetail)
//     private readonly productDetailRepository: Repository<ProductDetail>,
//     @InjectRepository(Material) // Inject Material Repository
//     private readonly materialRepository: Repository<Material>,
//     @InjectRepository(Product) // Inject Product Repository
//     private readonly productRepository: Repository<Product>,
//   ) {}

//   async findAll(): Promise<ProductDetail[]> {
//     try {
//       return await this.productDetailRepository.find({
//         where: { delete_flag: false },
//         relations: ['product', 'material', 'category'], // Giữ nguyên relations nếu bạn muốn tải dữ liệu liên quan
//       });
//     } catch (error) {
//       console.error('Error fetching product details:', error);
//       throw new HttpException(
//         'Failed to fetch product details',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async findOne(id: string): Promise<ProductDetail | null> {
//     try {
//       return await this.productDetailRepository.findOne({
//         where: { product_detail_id: id, delete_flag: false },
//         relations: ['product', 'material', 'category'], // Giữ nguyên relations nếu bạn muốn tải dữ liệu liên quan
//       });
//     } catch (error) {
//       console.error('Error fetching product detail:', error);
//       throw new HttpException(
//         'Failed to fetch product detail',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async create(
//     createProductDetailDto: CreateProductDetailDto,
//   ): Promise<ProductDetail> {
//     try {
//       // Validate product_id (parent_product_id) exists in products table
//       const parentProduct = await this.productRepository.findOne({
//         where: {
//           product_id: createProductDetailDto.product_id,
//           delete_flag: false,
//         },
//       });
//       if (!parentProduct) {
//         throw new HttpException(
//           'Parent product not found',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       // Validate component_item_id based on component_item_type
//       let componentExists = false;
//       if (
//         createProductDetailDto.component_item_type ===
//         ComponentItemType.MATERIAL
//       ) {
//         const material = await this.materialRepository.findOne({
//           where: {
//             material_id: createProductDetailDto.material_id,
//             delete_flag: false,
//           },
//         });
//         if (material) {
//           componentExists = true;
//         }
//       } else if (
//         createProductDetailDto.component_item_type === ComponentItemType.PRODUCT
//       ) {
//         const product = await this.productRepository.findOne({
//           where: {
//             product_id: createProductDetailDto.material_id,
//             delete_flag: false,
//           }, // material_id trong DTO sẽ chứa product_id của bán thành phẩm
//         });
//         if (product) {
//           componentExists = true;
//         }
//       }

//       if (!componentExists) {
//         throw new HttpException(
//           'Component item not found or invalid type',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       // Create a new ProductDetail entity instance
//       const productDetail = this.productDetailRepository.create({
//         product_id: createProductDetailDto.product_id,
//         material_quantity: createProductDetailDto.material_quantity,
//         category_id: createProductDetailDto.category_id, // category_id của BOM
//         component_item_type: createProductDetailDto.component_item_type,
//         // total_price sẽ được tính toán ở đây hoặc trong một hook/listener nếu cần
//         created_user: createProductDetailDto.created_user,
//         updated_user: createProductDetailDto.updated_user,
//       });

//       // Set material or product based on component_item_type
//       if (
//         createProductDetailDto.component_item_type ===
//         ComponentItemType.MATERIAL
//       ) {
//         productDetail.material = await this.materialRepository.findOne({
//           where: {
//             material_id: createProductDetailDto.material_id,
//             delete_flag: false,
//           },
//         });
//       } else if (
//         createProductDetailDto.component_item_type === ComponentItemType.PRODUCT
//       ) {
//         productDetail.material = await this.productRepository.findOne({
//           where: {
//             product_id: createProductDetailDto.material_id,
//             delete_flag: false,
//           },
//         });
//       }

//       // Gán các trường CommonEntity nếu chưa được xử lý tự động
//       productDetail.created_time = new Date();
//       productDetail.delete_flag = false;

//       return await this.productDetailRepository.save(productDetail);
//     } catch (error) {
//       console.error('Error creating product detail:', error);
//       if (error instanceof HttpException) {
//         throw error;
//       }
//       throw new HttpException(
//         'Failed to create product detail',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async update(
//     id: string,
//     updateProductDetailDto: CreateProductDetailDto,
//   ): Promise<ProductDetail | null> {
//     try {
//       const existingProductDetail = await this.findOne(id);
//       if (!existingProductDetail) {
//         throw new HttpException(
//           'Product detail not found',
//           HttpStatus.NOT_FOUND,
//         );
//       }

//       // Validate parent product and component item existence (similar to create)
//       const parentProduct = await this.productRepository.findOne({
//         where: {
//           product_id: updateProductDetailDto.product_id,
//           delete_flag: false,
//         },
//       });
//       if (!parentProduct) {
//         throw new HttpException(
//           'Parent product not found',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       let componentExists = false;
//       if (
//         updateProductDetailDto.component_item_type ===
//         ComponentItemType.MATERIAL
//       ) {
//         const material = await this.materialRepository.findOne({
//           where: {
//             material_id: updateProductDetailDto.material_id,
//             delete_flag: false,
//           },
//         });
//         if (material) {
//           componentExists = true;
//         }
//       } else if (
//         updateProductDetailDto.component_item_type === ComponentItemType.PRODUCT
//       ) {
//         const product = await this.productRepository.findOne({
//           where: {
//             product_id: updateProductDetailDto.material_id,
//             delete_flag: false,
//           },
//         });
//         if (product) {
//           componentExists = true;
//         }
//       }

//       if (!componentExists) {
//         throw new HttpException(
//           'Component item not found or invalid type',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       // Cập nhật các thuộc tính từ DTO vào entity hiện có
//       existingProductDetail.product_id = updateProductDetailDto.product_id;
//       existingProductDetail.material_quantity =
//         updateProductDetailDto.material_quantity;
//       existingProductDetail.category_id = updateProductDetailDto.category_id;
//       existingProductDetail.component_item_type =
//         updateProductDetailDto.component_item_type;

//       // Update material or product based on component_item_type
//       if (
//         updateProductDetailDto.component_item_type ===
//         ComponentItemType.MATERIAL
//       ) {
//         existingProductDetail.material = await this.materialRepository.findOne({
//           where: {
//             material_id: updateProductDetailDto.material_id,
//             delete_flag: false,
//           },
//         });
//       } else if (
//         updateProductDetailDto.component_item_type === ComponentItemType.PRODUCT
//       ) {
//         existingProductDetail.material = await this.productRepository.findOne({
//           where: {
//             product_id: updateProductDetailDto.material_id,
//             delete_flag: false,
//           },
//         });
//       }
//       // existingProductDetail.total_price = ... (tính toán lại nếu cần)
//       if (updateProductDetailDto.updated_user !== undefined) {
//         existingProductDetail.updated_user =
//           updateProductDetailDto.updated_user;
//       }
//       existingProductDetail.updated_time = new Date();

//       await this.productDetailRepository.save(existingProductDetail);
//       return await this.findOne(id); // Trả về entity đã cập nhật
//     } catch (error) {
//       console.error('Error updating product detail:', error);
//       if (error instanceof HttpException) {
//         throw error;
//       }
//       throw new HttpException(
//         'Failed to update product detail',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async remove(id: string): Promise<void> {
//     try {
//       const productDetail = await this.findOne(id);
//       if (!productDetail) {
//         throw new HttpException(
//           'Product detail not found',
//           HttpStatus.NOT_FOUND,
//         );
//       }
//       productDetail.delete_flag = true;
//       productDetail.updated_time = new Date();
//       await this.productDetailRepository.save(productDetail);
//     } catch (error) {
//       console.error('Error removing product detail:', error);
//       if (error instanceof HttpException) {
//         throw error;
//       }
//       throw new HttpException(
//         'Failed to remove product detail',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
//   /**
//    * 🔹 Multi-level BOM: trả về BOM đã FLATTEN thành danh sách Material cuối cùng
//    * - quantity = số portion của product gốc
//    * - Tự động expand bán thành phẩm (component_item_type = PRODUCT)
//    */
//   async getFlattenedBom(
//     productId: string,
//     quantity = 1,
//   ): Promise<FlattenedBomLine[]> {
//     const acc = new Map<string, FlattenedBomLine>();
//     const visited = new Set<string>();

//     await this.expandBomRecursive(productId, quantity, acc, visited);

//     return Array.from(acc.values());
//   }

//   /** Helper: validate component theo type */
//   private async validateComponentExists(
//     componentId: string,
//     type: ComponentItemType,
//   ): Promise<void> {
//     if (type === ComponentItemType.MATERIAL) {
//       const material = await this.materialRepository.findOne({
//         where: { material_id: componentId, delete_flag: false },
//       });
//       if (!material) {
//         throw new HttpException(
//           'Material component not found',
//           HttpStatus.BAD_REQUEST,
//         );
//       }
//     } else if (type === ComponentItemType.PRODUCT) {
//       const product = await this.productRepository.findOne({
//         where: { product_id: componentId, delete_flag: false },
//       });
//       if (!product) {
//         throw new HttpException(
//           'Product component (semi-finished) not found',
//           HttpStatus.BAD_REQUEST,
//         );
//       }
//     } else {
//       throw new HttpException(
//         'Invalid component_item_type',
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   /** Đệ quy expand BOM multi-level, gom về Material cuối cùng */
//   private async expandBomRecursive(
//     productId: string,
//     factor: number,
//     acc: Map<string, FlattenedBomLine>,
//     visited: Set<string>,
//   ): Promise<void> {
//     if (visited.has(productId)) {
//       // tránh vòng lặp BOM
//       console.warn('Detected circular BOM at product', productId);
//       return;
//     }
//     visited.add(productId);

//     const details = await this.productDetailRepository.find({
//       where: { product_id: productId, delete_flag: false },
//       relations: ['material'],
//     });

//     for (const detail of details) {
//       const qty = Number(detail.material_quantity || 0) * factor;

//       if (detail.component_item_type === ComponentItemType.MATERIAL) {
//         const material = detail.material;
//         if (!material) {
//           // material không được load từ relations, skip
//           continue;
//         }

//         const existing = acc.get(material.material_id);
//         if (existing) {
//           existing.quantity += qty;
//         } else {
//           acc.set(material.material_id, {
//             material_id: material.material_id,
//             material_name: material.material_name,
//             unit: material.unit,
//             quantity: qty,
//           });
//         }
//       } else if (detail.component_item_type === ComponentItemType.PRODUCT) {
//         // bán thành phẩm -> đi đệ quy xuống BOM của nó
//         if (detail.material) {
//           await this.expandBomRecursive(
//             detail.material.product_id,
//             qty,
//             acc,
//             visited,
//           );
//         }
//       }
//     }
//   }
// }

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<ProductDetail[]> {
    try {
      return await this.productDetailRepository.find({
        where: { delete_flag: false },
        relations: ['product', 'material', 'category'],
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new HttpException(
        'Failed to fetch product details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<ProductDetail | null> {
    try {
      return await this.productDetailRepository.findOne({
        where: { product_detail_id: id, delete_flag: false },
        relations: ['product', 'material', 'category'],
      });
    } catch (error) {
      console.error('Error fetching product detail:', error);
      throw new HttpException(
        'Failed to fetch product detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createProductDetailDto: CreateProductDetailDto,
  ): Promise<ProductDetail> {
    try {
      const {
        product_id,
        material_id,
        component_item_type,
        material_quantity,
        category_id,
        created_user,
        updated_user,
      } = createProductDetailDto;

      // 1. Validate parent product tồn tại
      const parentProduct = await this.productRepository.findOne({
        where: { product_id, delete_flag: false },
      });
      if (!parentProduct) {
        throw new HttpException(
          'Parent product not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Validate component tồn tại
      await this.validateComponentExists(material_id, component_item_type);

      // 3. Tạo entity
      const productDetail = this.productDetailRepository.create({
        product_id,
        material_id, // ID của Material hoặc Product (bán thành phẩm)
        component_item_type,
        material_quantity,
        category_id,
        created_user,
        updated_user,
      });

      // CommonEntity fields
      productDetail.created_time = new Date();
      productDetail.delete_flag = false;

      return await this.productDetailRepository.save(productDetail);
    } catch (error) {
      console.error('Error creating product detail:', error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Failed to create product detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateProductDetailDto: CreateProductDetailDto,
  ): Promise<ProductDetail | null> {
    try {
      const existing = await this.findOne(id);
      if (!existing) {
        throw new HttpException(
          'Product detail not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const {
        product_id,
        material_id,
        component_item_type,
        material_quantity,
        category_id,
        updated_user,
      } = updateProductDetailDto;

      // 1. Validate parent product
      const parentProduct = await this.productRepository.findOne({
        where: { product_id, delete_flag: false },
      });
      if (!parentProduct) {
        throw new HttpException(
          'Parent product not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Validate component
      await this.validateComponentExists(material_id, component_item_type);

      // 3. Cập nhật entity
      existing.product_id = product_id;
      existing.material_id = material_id;
      existing.component_item_type = component_item_type;
      existing.material_quantity = material_quantity;
      existing.category_id = category_id;
      if (updated_user !== undefined) {
        existing.updated_user = updated_user;
      }
      existing.updated_time = new Date();

      await this.productDetailRepository.save(existing);

      return await this.findOne(id);
    } catch (error) {
      console.error('Error updating product detail:', error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        'Failed to update product detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async remove(id: string): Promise<void> {
  //   try {
  //     const productDetail = await this.findOne(id);
  //     if (!productDetail) {
  //       throw new HttpException(
  //         'Product detail not found',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     productDetail.delete_flag = true;
  //     productDetail.updated_time = new Date();

  //     await this.productDetailRepository.save(productDetail);
  //   } catch (error) {
  //     console.error('Error removing product detail:', error);
  //     if (error instanceof HttpException) throw error;

  //     throw new HttpException(
  //       'Failed to remove product detail',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async remove(id: string): Promise<void> {
    const detail = await this.productDetailRepository.findOne({
      where: { product_detail_id: id },
    });
    if (!detail) {
      throw new HttpException('Product detail not found', HttpStatus.NOT_FOUND);
    }

    await this.productDetailRepository.update(detail.product_detail_id, {
      delete_flag: true,
      updated_time: new Date(),
    });
  }

  /**
   * Multi-level BOM:
   * - Nhận productId + quantity (số portion)
   * - Expand toàn bộ BOM (kể cả bán thành phẩm) thành list Material cuối cùng
   */
  async getFlattenedBom(
    productId: string,
    quantity = 1,
  ): Promise<FlattenedBomLine[]> {
    const acc = new Map<string, FlattenedBomLine>();
    const visited = new Set<string>();

    await this.expandBomRecursive(productId, quantity, acc, visited);

    return Array.from(acc.values());
  }

  /**
   * Helper: validate component theo type
   * - MATERIAL -> phải tồn tại trong bảng materials
   * - PRODUCT  -> phải tồn tại trong bảng products (bán thành phẩm / thành phẩm)
   */
  private async validateComponentExists(
    componentId: string,
    type: ComponentItemType,
  ): Promise<void> {
    if (type === ComponentItemType.MATERIAL) {
      const material = await this.materialRepository.findOne({
        where: { material_id: componentId, delete_flag: false },
      });
      if (!material) {
        throw new HttpException(
          'Material component not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      return;
    }

    if (type === ComponentItemType.PRODUCT) {
      const product = await this.productRepository.findOne({
        where: { product_id: componentId, delete_flag: false },
      });
      if (!product) {
        throw new HttpException(
          'Product component (semi-finished) not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      return;
    }

    throw new HttpException(
      'Invalid component_item_type',
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   * Đệ quy expand BOM:
   * - productId: id của Product (thành phẩm hoặc bán thành phẩm)
   * - factor: multiplier tương ứng với quantity cấp trên
   * - acc: map để cộng dồn quantity từng Material
   * - visited: tránh vòng lặp BOM
   */
  private async expandBomRecursive(
    productId: string,
    factor: number,
    acc: Map<string, FlattenedBomLine>,
    visited: Set<string>,
  ): Promise<void> {
    if (visited.has(productId)) {
      console.warn('Detected circular BOM at product', productId);
      return;
    }
    visited.add(productId);

    const details = await this.productDetailRepository.find({
      where: { product_id: productId, delete_flag: false },
      relations: ['material'], // relation này chỉ meaningful khi component_item_type = MATERIAL
    });

    for (const detail of details) {
      const quantity = Number(detail.material_quantity || 0) * factor;

      if (detail.component_item_type === ComponentItemType.MATERIAL) {
        const material = detail.material;
        if (!material) {
          continue;
        }

        const existing = acc.get(material.material_id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          acc.set(material.material_id, {
            material_id: material.material_id,
            material_name: material.material_name,
            unit: material.unit,
            quantity,
          });
        }
      } else if (detail.component_item_type === ComponentItemType.PRODUCT) {
        // bán thành phẩm: material_id đang chứa product_id của sub-product
        await this.expandBomRecursive(
          detail.material_id,
          quantity,
          acc,
          visited,
        );
      }
    }
  }
}
