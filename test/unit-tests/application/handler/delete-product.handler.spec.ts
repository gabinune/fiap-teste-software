import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';
import { Product } from 'src/domain/product.entity';
import { DeleteProductHandler } from 'src/application/commands/handlers/delete-product.handler';
import { DeleteProductCommand } from 'src/application/commands/delete-product.command';

describe('DeleteProductHandler', () => {
  let handler: DeleteProductHandler;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductHandler,
        {
          provide: ProductRepository,
          useValue: {
            findById: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteProductHandler>(DeleteProductHandler);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('execute - Quando o produto existe - Deve deletar o produto', async () => {
    const command = new DeleteProductCommand('id1');
    const product = Product.create('Product Name', 100.0);
    jest.spyOn(repository, 'findById').mockResolvedValue(product);

    await handler.execute(command);

    expect(repository.deleteProduct).toHaveBeenCalledWith('id1');
  });

  it('execute - Quando o produto não existe - Deve lançar um erro', async () => {
    const command = new DeleteProductCommand('id1');
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrowError('Product not found');
  });
});