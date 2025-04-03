import { RowDataPacket } from "mysql2";

export interface IOrderItem extends RowDataPacket {
  id: number | null;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url?: string;
  created_at: string;
}
