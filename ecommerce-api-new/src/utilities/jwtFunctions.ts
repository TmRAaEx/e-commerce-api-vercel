import jwt from "jsonwebtoken";
import { ICustomer } from "../models/ICustomer";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const generateCustomerToken = (customer: {
  id: ICustomer["id"];
  email: ICustomer["email"];
}) => {
  return jwt.sign(customer, JWT_SECRET, { expiresIn: "24h" });
};
