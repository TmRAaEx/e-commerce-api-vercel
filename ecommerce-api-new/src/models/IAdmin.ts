import { RowDataPacket } from "mysql2";

export interface IAdmin extends RowDataPacket{
    id: number | null;
    username: string;
    password: string;
}