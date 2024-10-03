import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/domain/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async saveProduct(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
  
  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async getProductsWithFilters(name?: string, minPrice?: number, maxPrice?: number): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }
    if (minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    return await query.getMany();
  }
}