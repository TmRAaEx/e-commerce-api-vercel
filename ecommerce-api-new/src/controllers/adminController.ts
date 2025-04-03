import { Request, Response } from "express";
import { IAdmin } from "../models/IAdmin";
import { logError } from "../utilities/logger";
import dotenv from "dotenv";
dotenv.config();

import * as adminService from "../services/adminService";

export const getAdmins = async (_: any, res: Response) => {
  try {
    const admins = await adminService.getAdmins();

    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body as IAdmin;

  const admin_api_key = process.env.ADMIN_KEY;

  const apiKey = req.headers["x-api-key"];

  console.log(apiKey);
  

  if (!apiKey || apiKey !== admin_api_key) {
    console.log("womp womp");
    
    res.status(403).json({ error: "Forbidden: Invalid API Key" });
    return;
  }

  try {
    const createdAdmin = await adminService.createAdmin(username, password);
    res.status(201).json({
      message: "Admin created",
      insertedID: createdAdmin,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "User already exists!" });
      return;
    }

    res.status(500).json({ error: logError(error) });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { username, password }: IAdmin = req.body;

  try {
    const adminAuth = await adminService.authenticateAdmin(username, password);

    if (!adminAuth) {
      res.status(403).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true, user: adminAuth });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};
