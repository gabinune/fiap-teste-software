import { Module } from '@nestjs/common';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { CreateProductHandler } from './application/commands/handlers/create-product.handler';
import { DeleteProductHandler } from './application/commands/handlers/delete-product.handler';
import { UpdateProductHandler } from './application/commands/handlers/update-product.handler';
import { ProductController } from './presentation/controllers/product.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from './domain/product.entity'; // Certifique-se de usar o caminho correto
import typeormConfig from './infrastructure/config/typeorm'; // Certifique-se de que a configuração do TypeORM está correta
import { GetProductsHandler } from './application/querys/handlers/get-products.handler';
import { GetProductsWithFiltersHandler } from './application/querys/handlers/get-products-with-filters.handler';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    // Carregar as opções de conexão com o banco de dados
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm'),
    }),
    // Carregar a entidade Product no módulo para o repositório
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [
    ProductRepository,
    CreateProductHandler,
    DeleteProductHandler,
    UpdateProductHandler,
    GetProductsHandler,
    GetProductsWithFiltersHandler,
  ],
})
export class AppModule {}