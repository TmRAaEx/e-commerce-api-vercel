import { db } from "../config/db";
import { IProduct } from "../models/IProduct";
import { ResultSetHeader } from "mysql2";

const getProducts = async (): Promise<IProduct[]> => {
  try {
    const sql = "SELECT * FROM products";
    const [rows] = await db.query<IProduct[]>(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (
  id: IProduct["id"]
): Promise<IProduct | boolean> => {
  try {
    const sql = "SELECT * FROM products WHERE id = ?";
    const [rows] = await db.query<IProduct[]>(sql, [id]);

    return rows && rows.length > 0 ? rows[0] : false;
  } catch (error) {
    throw error;
  }
};

const createProduct = async (
  name: IProduct["name"],
  description: IProduct["description"],
  price: IProduct["price"],
  stock: IProduct["stock"],
  category: IProduct["category"],
  image: IProduct["image"]
): Promise<IProduct["id"]> => {
  try {
    const sql = `
      INSERT INTO products (name, description, price,regular_price, stock, category, image) 
      VALUES (?, ?, ?,?, ?, ?, ?)
    `;
    const params = [name, description, price, price, stock, category, image];
    const [result] = await db.query<ResultSetHeader>(sql, params);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (
  name: IProduct["name"],
  description: IProduct["description"],
  price: IProduct["price"],
  regular_price: IProduct["regular_price"],
  stock: IProduct["stock"],
  category: IProduct["category"],
  image: IProduct["image"],
  id: IProduct["image"]
): Promise<boolean> => {
  try {
    const sql = `
          UPDATE products 
          SET name = ?, description = ?, price = ?, regular_price = ?, stock = ?, category = ?, image = ? 
          WHERE id = ?
        `;
    const params = [
      name,
      description,
      price,
      regular_price,
      stock,
      category,
      image,
      id,
    ];
    const [result] = await db.query<ResultSetHeader>(sql, params);

    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id: IProduct["id"]): Promise<boolean> => {
  try {
    const sql = "DELETE FROM products WHERE id = ?";
    const [result] = await db.query<ResultSetHeader>(sql, [id]);

    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
