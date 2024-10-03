import { StartedPostgreSqlContainer, PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';
import { Product } from 'src/domain/product.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('ProductRepository Integration', () => {
  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let productRepository: ProductRepository;
  let repository: Repository<Product>;

  beforeAll(async () => {
    // Inicializa o container PostgreSQL com Testcontainers
    container = await new PostgreSqlContainer().start();

    // Conecta-se ao banco de dados
    dataSource = new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      entities: [Product],
      synchronize: true,
    });

    await dataSource.initialize();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getPort(),
          username: container.getUsername(),
          password: container.getPassword(),
          database: container.getDatabase(),
          entities: [Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      providers: [ProductRepository],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  }, 30000); // Timeout aumentado para 30 segundos

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
    if (container) {
      await container.stop();
    }
  });

  it('deve salvar e recuperar um produto do banco de dados', async () => {
    const product = Product.create('Produto Teste', 100);
    await productRepository.saveProduct(product);
  
    const savedProduct = await productRepository.findById(product.getId());
  
    expect(savedProduct).toBeDefined();
    expect(savedProduct.getName()).toBe('Produto Teste');
    expect(Number(savedProduct.getPrice())).toBe(100); // Conversão do valor
  });
});