import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductRepository } from '../repositories/product_repository';
import { Product } from '../interfaces/product';

export class ProductHandler {
  static async createProduct(req: FastifyRequest<{ Body: Product }>, reply: FastifyReply) {
    const newProduct = await ProductRepository.createProduct(req.body);
    return reply.status(201).send(newProduct);
  }

  static async getProducts(req: FastifyRequest, reply: FastifyReply) {
    const products = await ProductRepository.getAllProducts();
    return reply.send(products);
  }

  static async getProductById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const product = await ProductRepository.getProductById(req.params.id);
    return product ? reply.send(product) : reply.status(404).send({ message: 'Product not found' });
  }

  static async updateProduct(req: FastifyRequest<{ Params: { id: string }; Body: Partial<Product> }>, reply: FastifyReply) {
    const updatedProduct = await ProductRepository.updateProduct(req.params.id, req.body);
    return reply.send(updatedProduct);
  }

  static async deleteProduct(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await ProductRepository.deleteProduct(req.params.id);
    return reply.status(204).send();
  }
}
