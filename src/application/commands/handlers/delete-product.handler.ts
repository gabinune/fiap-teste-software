import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from '../delete-product.command';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const { id } = command;

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await this.productRepository.deleteProduct(id);
  }
}