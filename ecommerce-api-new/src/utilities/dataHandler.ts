import { IOrderItem } from "../models/IOrderItem";

export const formatOrderDetails = (orderId, rows) => ({
  id: orderId,
  customer_id: rows[0].customer_id,
  total_price: rows[0].total_price,
  payment_status: rows[0].payment_status,
  payment_id: rows[0].payment_id,
  order_status: rows[0].order_status,
  created_at: rows[0].orders_created_at,
  customer_firstname: rows[0].firstname,
  customer_lastname: rows[0].lastname,
  customer_email: rows[0].email,
  customer_password: rows[0].password,
  customer_phone: rows[0].phone,
  customer_street_address: rows[0].street_address,
  customer_postal_code: rows[0].postal_code,
  customer_city: rows[0].city,
  customer_country: rows[0].country,
  order_items: rows[0].id
    ? rows.map((item: IOrderItem) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        image_url: item.image_url,
      }))
    : [],
});
