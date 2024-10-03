import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProductsWithFiltersQuery } from '../get-products-with-filters.query';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';

@QueryHandler(GetProductsWithFiltersQuery)
export class GetProductsWithFiltersHandler implements IQueryHandler<GetProductsWithFiltersQuery> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: GetProductsWithFiltersQuery): Promise<any> {
    const { name, minPrice, maxPrice } = query;
    return await this.productRepository.getProductsWithFilters(name, minPrice, maxPrice);
  }
}
