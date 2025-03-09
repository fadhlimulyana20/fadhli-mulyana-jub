import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE TABLE product_stock_logs (
            id SERIAL PRIMARY KEY,
            product_id int4,
            stock_delta int4,
            stock int4,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TABLE product_stock_logs;
    `)
}

