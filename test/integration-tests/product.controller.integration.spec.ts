import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository';
import { Product } from 'src/domain/product.entity';
import { ProductController } from 'src/presentation/controllers/product.controller';
import { StartedPostgreSqlContainer, PostgreSqlContainer } from '@testcontainers/postgresql';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from 'src/application/commands/handlers/create-product.handler';
import { GetProductsHandler } from 'src/application/querys/handlers/get-products.handler';

describe('ProductController (Integration)', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  const logger = new Logger('ProductControllerTest');

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getPort(),
          username: container.getUsername(),
          password: container.getPassword(),
          database: container.getDatabase(),
          entities: [Product],
          synchronize: true, // Sincroniza a estrutura automaticamente para o teste
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      controllers: [ProductController],
      providers: [
        ProductRepository,
        CreateProductHandler,
        GetProductsHandler,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  }, 30000); 

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (container) {
      await container.stop();
    }
  });

  it('POST /products - Quando os dados do produto são válidos - Deve criar o produto com sucesso', async () => {
    logger.debug('Enviando dados para criar o produto');
    
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Produto Teste', price: 150 });

    logger.debug('Resposta recebida:', response.body); 

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toBe('Produto Teste');
    expect(response.body).toHaveProperty('price');
    expect(response.body.price).toBe(150);
  });

  it('GET /products - Quando solicitado - Deve retornar uma lista de produtos', async () => {
    const response = await request(app.getHttpServer()).get('/products');

    logger.debug('Produtos retornados:', response.body); 

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});