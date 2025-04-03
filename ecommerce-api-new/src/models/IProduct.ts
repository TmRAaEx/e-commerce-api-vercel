import { RowDataPacket } from "mysql2";

export interface IProduct extends RowDataPacket {
  id: number | null;
  name: string;
  description: string;
  price: number;
  regular_price: number;
  stock: number;
  category: string;
  image: string;
  created_at: string;
}
