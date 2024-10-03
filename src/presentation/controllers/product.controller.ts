import { Controller, Post, Body, Get, Param, Query, Put, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from 'src/application/commands/create-product.command';
import { UpdateProductCommand } from 'src/application/commands/update-product.command';
import { DeleteProductCommand } from 'src/application/commands/delete-product.command';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetProductsQuery } from 'src/application/querys/get-products.query';
import { GetProductsWithFiltersQuery } from 'src/application/querys/get-products-with-filters.query';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ schema: { example: { name: 'Product A', price: 100 } } })
  @Post()
  async createProduct(@Body() body: { name: string; price: number }) {
    const { name, price } = body;
    return await this.commandBus.execute(new CreateProductCommand(name, price));
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  async getProducts() {
    return await this.queryBus.execute(new GetProductsQuery());
  }

  @ApiOperation({ summary: 'Get products with filters' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @Get('filter')
  async getProductsWithFilters(
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return await this.queryBus.execute(new GetProductsWithFiltersQuery(name, minPrice, maxPrice));
  }

  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ schema: { example: { name: 'Updated Product A', price: 150 } } })
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: { name?: string; price?: number },
  ) {
    const { name, price } = body;
    return await this.commandBus.execute(new UpdateProductCommand(id, name, price));
  }

  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteProductCommand(id));
  }
}