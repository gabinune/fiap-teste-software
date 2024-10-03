import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '../update-product.command';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const { id, name, price } = command;

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.update(name, price);

    await this.productRepository.saveProduct(product);
  }
}