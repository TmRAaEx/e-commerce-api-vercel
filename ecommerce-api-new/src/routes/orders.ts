import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByPaymentID,
  getOrdersByCustomerId,
} from "../controllers/orderController";
import { authenticateUser } from "../middleware/authUserMiddleware";
const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.get("/paymentID/:payment_id", getOrderByPaymentID);
router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.get("/customerID/:customer_id", authenticateUser, getOrdersByCustomerId);

export default router;
