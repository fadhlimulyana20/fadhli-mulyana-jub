/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const API_URL = 'https://fakestoreapi.com/products'; // Example API

function cleanString(str) {
  if (typeof str === "string") {
    return str.replace(/'/g, "''").trim(); // Escape apostrophe for SQL
  }
  return str;
}

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function bulkImport(db, products) {
  if (products.length === 0) return "No products to import.";

  // Extract titles and IDs to check for duplicates
  const titles = products.map((p) => p.title);
  const ids = products.map((p) => p.id).filter((id) => id !== undefined);

  try {
    // Find existing products with matching ID or title
    const existingProducts = await db.raw(
      `SELECT id, title FROM products WHERE id = ANY(?) OR title = ANY(?)`,
      [ids, titles]
    );

    const existingIds = new Set(existingProducts.rows.map((p) => p.id));
    const existingTitles = new Set(existingProducts.rows.map((p) => p.title));

    // Filter out duplicates
    const newProducts = products.filter(
      (p) => !existingIds.has(p.id) && !existingTitles.has(p.title)
    );

    if (newProducts.length === 0) return "No new products to import.";

    //Insert only new products
    const values = newProducts
      .map(
        (p) =>
          `('${cleanString(p.title)}', ${p.price}, '${cleanString(p.description)}', '${cleanString(p.category)}', '${p.image}', ${p.stock ?? 0})`
      )
      .join(",");


    await db.raw(
      `INSERT INTO products (title, price, description, category, image, stock) VALUES ${values}`
    );

    return `${newProducts.length} products imported successfully.`;
  } catch (error) {
    console.error("Bulk Import Error:", error);
    throw new Error("Failed to import products.");
  }
}


exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  try {
    const products = await fetchProducts()
    await bulkImport(knex, products)
  } catch (e) {
    console.log(e)
  }
};
