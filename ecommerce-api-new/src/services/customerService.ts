import { db } from "../config/db";
import { ICustomer } from "../models/ICustomer";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";

const getCustomers = async (): Promise<ICustomer[]> => {
  try {
    const sql = "SELECT * FROM customers";
    const [rows] = await db.query<ICustomer[]>(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getCustomerById = async (
  id: ICustomer["id"]
): Promise<ICustomer | false> => {
  try {
    const sql = "SELECT * FROM customers WHERE id = ?";
    const [rows] = await db.query<ICustomer[]>(sql, [id]);

    return rows && rows.length > 0 ? rows[0] : false;
  } catch (error) {
    throw error;
  }
};

const getCustomerByEmail = async (
  email: ICustomer["email"]
): Promise<ICustomer | false> => {
  try {
    const sql = "SELECT * FROM customers WHERE email = ?";
    const values = [email];
    const [rows] = await db.query<ICustomer[]>(sql, values);

    return rows && rows.length > 0 ? rows[0] : false;
  } catch (error) {
    throw error;
  }
};

const createCustomer = async (
  customer: ICustomer
): Promise<ICustomer["id"]> => {
  const customerData = Object.values(customer);
  customerData.shift(); //removes id that is null

  try {
    const sql = `
      INSERT INTO customers (firstname, lastname, email, phone, street_address, postal_code, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query<ResultSetHeader>(sql, customerData);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const updateCustomer = async (
  customer: ICustomer,
  id: string
): Promise<void> => {
  const customerData = Object.values(customer);
  customerData.push(id); // Add the id at the end for the WHERE clause

  try {
    const sql = `
      UPDATE customers 
      SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, street_address = ?, postal_code = ?, city = ?, country = ?
      WHERE id = ?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, customerData);

    if (result.affectedRows === 0) {
      throw new Error("Customer not found");
    }
  } catch (error) {
    throw error;
  }
};

const deleteCustomer = async (id: ICustomer["id"]): Promise<number> => {
  try {
    const sql = "DELETE FROM customers WHERE id = ?";
    const [result] = await db.query<ResultSetHeader>(sql, [id]);

    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

const auth_customer = async (
  email: ICustomer["email"],
  password: ICustomer["password"]
): Promise<ICustomer | false> => {
  try {
    const customer = await getCustomerByEmail(email);
    if (!customer) return false;

    const isValidPass = await bcrypt.compare(
      password as string,
      customer.password as string
    );
    return isValidPass ? customer : false;
  } catch (error) {
    throw error;
  }
};

const register_customer = async (
  customer: ICustomer
): Promise<ICustomer["id"]> => {
  if (!customer || !customer.password) {
    throw new Error("Invalid or incomplete data");
  }

  try {
    const hashedPassword = await bcrypt.hash(customer.password, 10);

    const customerData = Object.values({
      ...customer,
      password: hashedPassword,
    });

    console.log("customerData:", customerData);

    const sql = `
      INSERT INTO customers (firstname, lastname, email, password, phone, street_address, postal_code, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query<ResultSetHeader>(sql, customerData);

    return result.insertId;
  } catch (error) {
    console.error("Error registering customer:", error);
    throw new Error("Error registering customer. Please try again later.");
  }
};

export {
  getCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  auth_customer,
  register_customer,
};
