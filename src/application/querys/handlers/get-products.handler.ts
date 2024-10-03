import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from '../get-products.query';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<any> {
    return await this.productRepository.findAll();
  }
}