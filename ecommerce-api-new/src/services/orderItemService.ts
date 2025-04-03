import { ResultSetHeader } from "mysql2";
import { IOrderItem } from "../models/IOrderItem";
import { db } from "../config/db";
import { IOrder } from "../models/IOrder";

const updateOrderItem = async (
  id: IOrderItem["id"],
  quantity: IOrderItem["quantity"]
): Promise<boolean> => {
  try {
    const sql = `
      UPDATE order_items
      SET 
        quantity = ?
      WHERE id = ?
    `;
    const params = [quantity, id];
    const [result] = await db.query<ResultSetHeader>(sql, params);

    const [rows] = await db.query<IOrderItem[]>(
      "SELECT * FROM order_items WHERE id = ?",
      [id]
    );
    await updateOrderTotalPrice(rows[0].order_id);

    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const deleteOrderItem = async (id: IOrderItem["id"]): Promise<boolean> => {
  try {
    const [rows] = await db.query<IOrderItem[]>(
      "SELECT * FROM order_items WHERE id = ?",
      [id]
    );
    const sql = "DELETE FROM order_items WHERE id = ?";
    const [result] = await db.query<ResultSetHeader>(sql, [id]);
    await updateOrderTotalPrice(rows[0].order_id);

    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const getOrderItems = async (orderID: IOrder["id"]) => {
  const getOrderItems = `SELECT * FROM order_items WHERE order_id = ?`;

  const [rows] = await db.query<IOrderItem[]>(getOrderItems, [orderID]);

  return rows;
};


export { updateOrderItem, deleteOrderItem, getOrderItems };

const updateOrderTotalPrice = async (order_id: number) => {
  try {
    const sql = `
      UPDATE orders
      SET total_price = (
        SELECT COALESCE(SUM(unit_price * quantity),0) 
        FROM order_items 
        WHERE order_id = ?
      )
      WHERE id = ?
    `;
    const params = [order_id, order_id];
    await db.query(sql, params);
  } catch (error) {
    throw new Error();
  }
};
