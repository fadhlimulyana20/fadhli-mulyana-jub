import { FastifyInstance } from 'fastify';
import { ProductHandler } from '../handlers/product_handler';

export async function productRoutes(fastify: FastifyInstance) {
  fastify.post('/products', ProductHandler.createProduct);
  fastify.get('/products', ProductHandler.getProducts);
  fastify.get('/products/:id', ProductHandler.getProductById);
  fastify.put('/products/:id', ProductHandler.updateProduct);
  fastify.put('/products/update-stock/:id', ProductHandler.updateStock);
  fastify.delete('/products/:id', ProductHandler.deleteProduct);
  fastify.get('/products/stock-logs/:id', ProductHandler.getProductStockLogs);
  fastify.get('/products/categories', ProductHandler.getAllCategories);
}