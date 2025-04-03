import { IAdmin } from "../models/IAdmin";
import { db } from "../config/db";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";

const getAdmins = async (): Promise<IAdmin[]> => {
  try {
    const query = "SELECT id, username FROM admins";
    const [rows] = await db.query<IAdmin[]>(query);
    console.log(rows);

    return rows;
  } catch (error) {
    throw error;
  }
};

const createAdmin = async (
  username: IAdmin["username"],
  password: IAdmin["password"]
): Promise<IAdmin["id"]> => {
  try {
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);

    const query = `
        INSERT INTO admins (username, password)
        VALUES (?, ?)`;

    const queryValues = [username, hashedPassword];

    const [ResultSetHeader] = await db.query<ResultSetHeader>(
      query,
      queryValues
    );

    return ResultSetHeader.insertId;
  } catch (error) {
    throw error;
  }
};

const authenticateAdmin = async (
  username: IAdmin["username"],
  password: IAdmin["password"]
): Promise<IAdmin["username"] | false> => {
  try {
    const getUser = `SELECT * FROM admins WHERE username = ?`;
    const [rows] = await db.query<IAdmin[]>(getUser, [username]);

    if (rows.length === 0) {
      return false;
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return false;
    }

    return user.username;
  } catch (error) {
    throw error;
  }
};

export { getAdmins, createAdmin, authenticateAdmin };
