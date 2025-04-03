import { Request, Response } from "express";
import { IOrder } from "../models/IOrder";
import { logError } from "../utilities/logger";

import * as orderService from "../services/orderService";

export const getOrders = async (_: any, res: Response) => {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: logError(error) });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    const order = await orderService.getOrderById(Number(id));

    order
      ? res.status(200).json(order)
      : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const getOrderByPaymentID = async (req: Request, res: Response) => {
  const payment_id: string = req.params.payment_id;

  try {
    const order = await orderService.getOrderByPaymentId(payment_id);

    order
      ? res.status(200).json(order)
      : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { customer_id, payment_status, payment_id, order_status }: IOrder =
    req.body;

  try {
    const createdOrderID = await orderService.createOrder(
      customer_id,
      payment_status,
      payment_id,
      order_status,
      req.body.order_items
    );

    res
      .status(201)
      .json({ message: "Order created", insertedID: createdOrderID });
  } catch (error: unknown) {
    res.status(500).json({ error: logError(error) });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const { payment_status, payment_id, order_status }: IOrder = req.body;

  try {
    const updatedOrder = await orderService.updateOrder(
      Number(id),
      payment_status,
      payment_id,
      order_status
    );

    updatedOrder
      ? res.status(200).json({ message: "Order updated" })
      : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    const deletedOrder = await orderService.deleteOrder(Number(id));

    deletedOrder
      ? res.status(204)
      : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const getOrdersByCustomerId = async (req: Request, res: Response) => {
  const customer_id: string = req.params.customer_id;

  try {
    const order = await orderService.getOrdersByCustomerId(Number(customer_id));

    order
      ? res.status(200).json(order)
      : res.status(404).json({ message: "Order not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};
