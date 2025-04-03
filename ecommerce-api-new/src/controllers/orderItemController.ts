import { Request, Response } from "express";
import { db } from "../config/db";
import { logError } from "../utilities/logger";
import { IOrderItem } from "../models/IOrderItem";
import { ResultSetHeader } from "mysql2";

import * as orderItemService from "../services/orderItemService";

export const updateOrderItem = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { quantity }: IOrderItem = req.body;

  if (quantity <= 0) {
    res.status(400).json({ message: "Quantity must be greater than 0" });
    return;
  }

  try {
    const updatedOrderItem = await orderItemService.updateOrderItem(
      Number(id),
      quantity
    );

    updatedOrderItem
      ? res.status(204)
      : res.status(404).json({ message: "Order_item not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    const deletedOrderItem = await orderItemService.deleteOrderItem(Number(id));
    deletedOrderItem
      ? res.status(204)
      : res.status(404).json({ message: "Order_item not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};
