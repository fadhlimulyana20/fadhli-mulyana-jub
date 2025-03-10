import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductRepository } from '../repositories/product_repository';
import { Product } from '../interfaces/product';
import { IResponse } from '../interfaces/http';
import { z } from "zod";

export class ProductHandler {
  static async createProduct(req: FastifyRequest<{ Body: Product }>, reply: FastifyReply) {
    const newProduct = await ProductRepository.createProduct(req.body);
    return reply.status(201).send(newProduct);
  }

  static async getProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      // Define a validation schema using Zod
      const querySchema = z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("10"),
        search: z.string().optional(),
        category: z.string().optional(),
      });

      // Validate request query params
      const parsedQuery = querySchema.parse(req.query);

      // Convert page & limit to numbers
      const page = parseInt(parsedQuery.page, 10);
      const limit = parseInt(parsedQuery.limit, 10);

      // Fetch filtered and paginated products
      const products = await ProductRepository.getAllProducts(
        {
          search: parsedQuery.search,
          category: parsedQuery.category,
          limit,
          page
        }
      );

      const total_product = await ProductRepository.getTotalProducts()

      const response: IResponse<Array<Product>> = {
        message: 'success',
        status_code: 200,
        data: products,
        meta: {
          count: total_product,
          limit: limit,
          page: page
        }
      }
      return reply.send(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      reply.code(400)
      throw(error)
    }
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
    } catch (e: any) {
      reply.code(400)
      throw (e)
    }
  }

  static async getProductStockLogs(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    try {
      const productStockLogs = await ProductRepository.getProductStockLogs(req.params.id);
      return reply.send(productStockLogs);
    } catch (e: any) {
      reply.code(400)
      throw (e)
    }
  }
}
