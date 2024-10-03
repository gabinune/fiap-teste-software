
# Documentação do Projeto: Sistema de Cadastro de Produtos

## Sumário
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Testes Automatizados](#testes-automatizados)
5. [Endpoints da API](#endpoints-da-api)
6. [Integração Contínua com GitHub Actions](#integração-contínua-com-github-actions)

## Visão Geral
Este projeto é um sistema de cadastro de produtos desenvolvido em **NestJS**. Utilizamos a arquitetura **Clean Architecture**, o padrão **CQRS** e o **Domain-Driven Design (DDD)**. A aplicação também utiliza o **Testcontainers** para realizar testes de integração, simulando um banco de dados PostgreSQL.

## Arquitetura
A arquitetura do projeto segue princípios de **Clean Architecture** e **DDD**, separando responsabilidades entre diferentes camadas:
- **Camada de Aplicação**: Contém os `handlers` de comando e consulta, responsáveis por lidar com as regras de negócio.
- **Camada de Domínio**: Contém as entidades e regras de domínio, como a classe `Product`.
- **Camada de Infraestrutura**: Repositórios e interações com o banco de dados.
- **Camada de Apresentação**: Controladores que expõem os endpoints da API.

### Diagrama de Fluxo da Arquitetura
```
[ Apresentação (Controladores) ]  -->  [ Aplicação (CQRS Handlers) ]  -->  [ Domínio (Entidades e Regras) ]  -->  [ Infraestrutura (Repositórios e DB) ]
```

## Instalação e Configuração
### Pré-requisitos:
- **Node.js** (versão 16+)
- **Docker** (para rodar os testes com **Testcontainers**)
- **PostgreSQL** (ou usar o Testcontainers para simular)

### Passos de Instalação:
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio/projeto.git
   cd projeto
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com as variáveis de ambiente:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=produtos_db
   ```

4. Execute as migrações do banco de dados:
   ```bash
   npm run migration:run
   ```

5. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

## Testes Automatizados
### Testes Unitários
Utilizamos o **Jest** para criar testes unitários para as entidades e handlers. Os testes estão organizados na pasta `test/unit-tests`.

### Testes de Integração
Os testes de integração verificam a interação entre as camadas da aplicação, incluindo o uso do banco de dados através do **Testcontainers**. Esses testes estão localizados em `test/integration-tests`.

### Executando os Testes:
```bash
npm run test
```

## Endpoints da API
### 1. Criar Produto
- **Endpoint**: `POST /products`
- **Descrição**: Cria um novo produto.
- **Corpo da Requisição**:
   ```json
   {
     "name": "Produto Teste",
     "price": 150.0
   }
   ```
- **Resposta**:
   ```json
   {
     "id": "uuid",
     "name": "Produto Teste",
     "price": 150.0
   }
   ```

### 2. Listar Produtos
- **Endpoint**: `GET /products`
- **Descrição**: Retorna uma lista de todos os produtos cadastrados.

### 3. Atualizar Produto
- **Endpoint**: `PUT /products/:id`
- **Descrição**: Atualiza um produto existente pelo seu ID.
- **Corpo da Requisição**:
   ```json
   {
     "name": "Produto Atualizado",
     "price": 200.0
   }
   ```

### 4. Excluir Produto
- **Endpoint**: `DELETE /products/:id`
- **Descrição**: Remove um produto existente pelo seu ID.

## Integração Contínua com GitHub Actions
Utilizamos o **GitHub Actions** para executar testes automatizados a cada novo PR (Pull Request). O workflow está configurado para rodar em um ambiente **Node.js** com **Docker**, permitindo a execução dos testes que utilizam o **Testcontainers**.

### Arquivo `.github/workflows/github-actions.yml`:
```yaml

```

### Como Funciona:
- A cada **Pull Request** para os branches `main` ou `develop`, o workflow é acionado.
- O ambiente é configurado com **Node.js** e **Docker** para rodar os testes automatizados com **Testcontainers**.

## Conclusão
Este projeto demonstra a implementação de um sistema de cadastro de produtos utilizando boas práticas de desenvolvimento, como **Clean Architecture**, **DDD**, **CQRS** e testes automatizados. O uso de **Testcontainers** garante que os testes de integração sejam robustos e confiáveis, simulando um ambiente real.
