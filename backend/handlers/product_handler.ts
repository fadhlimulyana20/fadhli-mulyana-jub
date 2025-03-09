import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductRepository } from '../repositories/product_repository';
import { Product } from '../interfaces/product';
import { IResponse } from '../interfaces/http';

export class ProductHandler {
  static async createProduct(req: FastifyRequest<{ Body: Product }>, reply: FastifyReply) {
    const newProduct = await ProductRepository.createProduct(req.body);
    return reply.status(201).send(newProduct);
  }

  static async getProducts(req: FastifyRequest, reply: FastifyReply) {
    const products = await ProductRepository.getAllProducts();
    return reply.send(products);
  }

  static async getProductById(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const product = await ProductRepository.getProductById(req.params.id);
    return product ? reply.send(product) : reply.status(404).send({ message: 'Product not found' });
  }

  static async updateProduct(req: FastifyRequest<{ Params: { id: number }; Body: Partial<Product> }>, reply: FastifyReply) {
    const updatedProduct = await ProductRepository.updateProduct(req.params.id, req.body);
    return reply.send(updatedProduct);
  }

  static async deleteProduct(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    await ProductRepository.deleteProduct(req.params.id);
    return reply.status(204).send();
  }

  static async updateStock(req: FastifyRequest<{ Params: { id: number }, Body: { delta: number } }>, reply: FastifyReply) {
    try {
      const updatedProduct = await ProductRepository.updateProductStockDelta(req.params.id, req.body.delta);
      return reply.send(updatedProduct);
    } catch(e: any) {
      reply.code(400)
      throw(e)
    }
  }

  static async getProductStockLogs(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    try {
      const productStockLogs = await ProductRepository.getProductStockLogs(req.params.id);
      return reply.send(productStockLogs);
    } catch(e: any) {
      reply.code(400)
      throw(e)
    }
  }
}
