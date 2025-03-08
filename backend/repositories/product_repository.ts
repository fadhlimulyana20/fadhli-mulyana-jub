import db from "../db/knex"; // Assuming you have a Knex instance configured
import { Product } from "../interfaces/product";


export class ProductRepository {
  // Create a new product
  static async createProduct(product: Product): Promise<number> {
    const { title, price, description, category, image, stock = 0 } = product;
    const result = await db.raw(
      `INSERT INTO products (title, price, description, category, image, stock) 
       VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
      [title, price, description, category, image, stock]
    );
    return result.rows[0].id; // Return the inserted product ID
  }

  // Get a product by ID
  static async getProductById(id: string): Promise<Product | null> {
    const result = await db.raw(`SELECT * FROM products WHERE id = ?`, [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    const result = await db.raw(`SELECT * FROM products`);
    return result.rows;
  }

  // Update a product
  static async updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
    const fields = Object.keys(product).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(product);
    values.push(id); // Add the ID to the end

    const result = await db.raw(
      `UPDATE products SET ${fields} WHERE id = ? RETURNING id`,
      values
    );
    return result.rows.length > 0;
  }

  // Delete a product
  static async deleteProduct(id: string): Promise<boolean> {
    const result = await db.raw(`DELETE FROM products WHERE id = ? RETURNING id`, [id]);
    return result.rows.length > 0;
  }
}
