import express from "express";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { VercelRequest, VercelResponse } from "@vercel/node";
import cron from "node-cron";

import dotenv from "dotenv";
dotenv.config();
const app = express();

// Middleware
import stripeRouter from "./routes/checkout";

app.use("/checkout", stripeRouter); // must be placed here for express.raw()

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "*",
    credentials: true, // ✅ Allows cookies
  })
);

// Routes
import productRouter from "./routes/products";
import customerRouter from "./routes/customers";
import orderRouter from "./routes/orders";
import orderItemRouter from "./routes/orderItems";
import authRouter from "./routes/customers";
import adminRouter from "./routes/admins";
import moment from "moment";
app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/order-items", orderItemRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

// Attempt to connect to the database
connectDB();

// remove unhandled orders
import { deleteOrder, getOrders } from "./services/orderService";

cron.schedule("0 * * * *", async () => {
  console.log("Cron job running every hour");

  try {
    const orders = await getOrders();
    const currentTime = moment();

    // Find orders that are over an hour old and have a "pending" status
    const outdatedOrderIds = orders
      .filter((order) => {
        const orderCreatedAt = moment(order.created_at);
        return (
          currentTime.diff(orderCreatedAt, "hours") > 1 &&
          order.order_status === "pending"
        );
      })
      .map((order) => order.id);
    console.log(
      "Outdated order IDs (created more than an hour ago):",
      outdatedOrderIds
    );

    // Use Promise.all to delete all outdated orders
    if (outdatedOrderIds.length > 0) {
      await Promise.all(outdatedOrderIds.map((id) => deleteOrder(id)));
      console.log(
        `Successfully deleted ${outdatedOrderIds.length} outdated orders.`
      );
    } else {
      console.log("No outdated orders to delete.");
    }
  } catch (error) {
    console.error("Error running cron job:", error);
  }
});
// Start Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}`);
});

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
