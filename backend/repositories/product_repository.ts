import db from "../db/knex"; // Assuming you have a Knex instance configured
import { Product, ProductStockLog } from "../interfaces/product";


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
    static async getProductById(id: number): Promise<Product | null> {
        const result = await db.raw(`SELECT * FROM products WHERE id = ?`, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    // Get all products
    static async getAllProducts(
        {
            page = 1,
            limit = 10,
            search = "",
            category = ""
        } : {
            page: number;
            limit: number;
            search?: string;
            category?: string;
        }
    ): Promise<Product[]> {
        const offset = (page - 1) * limit; // Calculate offset for pagination

        let query = `SELECT * FROM products`;
        const queryParams: any[] = [];

        // Apply Search Filter (if provided)
        if (search) {
            query += ` WHERE lower(title) ILIKE ?`; // ILIKE for case-insensitive search (PostgreSQL)
            queryParams.push(`%${search.toLowerCase()}%`);
        }

        // Apply Category Filter (if provided)
        if (category) {
            query += search ? ` AND category = ?` : ` WHERE category = ?`;
            queryParams.push(category);
        }

        // Apply Sorting, Limit, and Offset
        query += ` ORDER BY created_at ASC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        // Execute Raw SQL Query
        const result = await db.raw(query, queryParams);
        return result.rows;
    }

    static async getTotalProducts(): Promise<number> {
        try {
            const result = await db.raw(`SELECT COUNT(*) AS total FROM products`);
            return Number(result.rows[0]?.total) || 0;
        } catch (error) {
            console.error("Error fetching total products:", error);
            throw new Error("Database error");
        }
    }

    // Update a product
    static async updateProduct(id: number, product: Partial<Product>): Promise<boolean> {
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
    static async deleteProduct(id: number): Promise<boolean> {
        const result = await db.raw(`DELETE FROM products WHERE id = ? RETURNING id`, [id]);
        return result.rows.length > 0;
    }

    // Update product stock using delta
    static async updateProductStockDelta(id: number, delta: number): Promise<Product | null> {
        try {
            let product = await this.getProductById(id)
            if (product !== null) {
                const tempStock = (product?.stock || 0) + delta
                if (tempStock < 0) {
                    throw new Error("stock can't be negative")
                }

                product = {
                    ...product,
                    stock: tempStock
                }
                await this.updateProduct(id, product)
                await this.createProductStockLog(Number(id), delta, tempStock)
                return product
            }
        } catch (e) {
            throw (e)
        }

        return null
    }

    static async createProductStockLog(product_id: number, stock_delta: number, stock: number): Promise<ProductStockLog | null> {
        let log: ProductStockLog = {
            id: 0,
            product_id,
            stock_delta,
            stock
        }

        try {
            const result = await db.raw(`
                INSERT INTO product_stock_logs (product_id, stock_delta, stock) 
                VALUES (?, ?, ?) RETURNING id
            `, [log.product_id, log.stock_delta, log.stock])

            log.id = result.rows[0].id

        } catch (e) {
            return null
        }
        return log
    }

    static async getProductStockLogs(product_id: number): Promise<ProductStockLog[]> {
        try {
            const res = await db.raw(`
                SELECT id, product_id, stock_delta, stock, created_at, updated_at
                FROM product_stock_logs
                WHERE product_id = ?
                ORDER BY created_at DESC
            `, [product_id])
            return res.rows
        } catch (e) {
            throw (e)
        }
    }
}
