import { ResultSetHeader } from "mysql2";
import { db } from "../config/db";
import { IOrder } from "../models/IOrder";
import { IOrderItem } from "../models/IOrderItem";
import { formatOrderDetails } from "../utilities/dataHandler";
import { ICustomer } from "../models/ICustomer";

const getOrders = async (): Promise<IOrder[]> => {
  try {
    const sql = `
          SELECT 
            orders.id AS id, 
            customer_id,
            total_price,
            payment_status,
            payment_id,
            order_status,
            orders.created_at,
            customers.id AS customer_id, 
            firstname AS customer_firstname, 
            lastname AS customer_lastname, 
            email AS customer_email, 
            firstname AS customer_firstname, 
            lastname AS customer_lastname,
            email AS customer_email,
            phone AS customer_phone,
            street_address AS customer_street_address,
            postal_code AS customer_postal_code,
            city AS customer_city,
            country AS customer_country,
            customers.created_at AS customers_created_at,
            orders.created_at AS created_at
          
          FROM orders
          LEFT JOIN customers ON orders.customer_id = customers.id`;
    const [rows] = await db.query<IOrder[]>(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (id: IOrder["id"]): Promise<any | boolean> => {
  try {
    const sql = `
          SELECT 
            *, 
            orders.created_at AS orders_created_at, 
            customers.created_at AS customers_created_at 
          FROM orders 
          LEFT JOIN customers ON orders.customer_id = customers.id
          LEFT JOIN order_items ON orders.id = order_items.order_id
          WHERE orders.id = ?
        `;
    const [rows] = await db.query<IOrder[]>(sql, [id]);

    return rows && rows.length > 0 ? formatOrderDetails(id, rows) : false;
  } catch (error) {
    throw error;
  }
};

const getOrderByPaymentId = async (
  payment_id: IOrder["payment_id"]
): Promise<any | boolean> => {
  try {
    const sql = `
          SELECT 
            *, 
            orders.created_at AS orders_created_at, 
            customers.created_at AS customers_created_at 
          FROM orders 
          LEFT JOIN customers ON orders.customer_id = customers.id
          LEFT JOIN order_items ON orders.id = order_items.order_id
          WHERE orders.payment_id = ?
        `;
    const [rows] = await db.query<IOrder[]>(sql, [payment_id]);

    return rows && rows.length > 0
      ? formatOrderDetails(payment_id, rows)
      : false;
  } catch (error) {
    throw error;
  }
};

const createOrder = async (
  customer_id: IOrder["customer_id"],
  payment_status: IOrder["payment_status"],
  payment_id: IOrder["payment_id"],
  order_status: IOrder["order_status"],
  order_items: IOrderItem[]
): Promise<IOrder["id"]> => {
  try {
    const sql = `
      INSERT INTO orders (customer_id, total_price, payment_status, payment_id, order_status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const totalPrice = order_items.reduce(
      (total: number, item: IOrderItem) =>
        total + item.quantity * item.unit_price,
      0
    );
    const params = [
      customer_id,
      totalPrice,
      payment_status,
      payment_id,
      order_status,
    ];

    const [result] = await db.query<ResultSetHeader>(sql, params);
    if (result.insertId) {
      const order_id: number = result.insertId;
      const orderItems = order_items;
      for (const orderItem of orderItems) {
        const data = { ...orderItem, order_id };
        await createOrderItem(data);
      }
    }

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const updateOrder = async (
  id: IOrder["id"],
  payment_status: IOrder["payment_status"],
  payment_id: IOrder["payment_id"],
  order_status: IOrder["order_status"]
): Promise<boolean> => {
  try {
    const sql = `
          UPDATE orders 
          SET payment_status = ?, payment_id = ?,order_status = ?
          WHERE id = ?
        `;
    const params = [payment_status, payment_id, order_status, id];
    const [result] = await db.query<ResultSetHeader>(sql, params);

    

    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const deleteOrder = async (id: IOrder["id"]): Promise<boolean> => {
  try {
    const sql = "DELETE FROM orders WHERE id = ?";
    const [result] = await db.query<ResultSetHeader>(sql, [id]);

    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const getOrdersByCustomerId = async (customer_id: ICustomer["id"]) => {
  try {
    const sql = `
          SELECT 
            *, 
            orders.created_at AS orders_created_at, 
            customers.created_at AS customers_created_at 
          FROM orders 
          LEFT JOIN customers ON orders.customer_id = customers.id
          LEFT JOIN order_items ON orders.id = order_items.order_id
          WHERE orders.customer_id = ?
        `;
    const [rows] = await db.query<IOrder[]>(sql, [customer_id]);

    console.log(rows);

    return rows && rows.length > 0
      ? formatOrderDetails(customer_id, rows)
      : false;
  } catch (error) {
    throw error;
  }
};

const createOrderItem = async (data: IOrderItem) => {
  const {
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    image_url,
  } = data;
  try {
    const sql = `
      INSERT INTO order_items (
        order_id, 
        product_id, 
        product_name, 
        quantity, 
        unit_price,
        image_url 
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      order_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      image_url,
    ];
    await db.query<ResultSetHeader>(sql, params);
  } catch (error) {
    throw new Error();
  }
};

export {
  getOrders,
  getOrderById,
  getOrderByPaymentId,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByCustomerId,
};
