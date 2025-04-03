import { db } from "../config/db";
import { IOrder } from "../models/IOrder";
import { updateOrder } from "./orderService";
import { getOrderItems } from "./orderItemService";

const createCheckoutSession = async (
  items: any[],
  orderID: IOrder["id"],
  stripe: any
): Promise<string> => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [...items],
      mode: "payment",
      ui_mode: "embedded",
      client_reference_id: orderID,
      return_url:
        "http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
    });

    return session.client_secret;
  } catch (error) {
    throw error;
  }
};

const webHookEvents = async (event: any) => {
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const { id: payment_id, client_reference_id } = session;

      try {
        await updateOrder(
          Number(client_reference_id), //order id
          "paid", // payment status
          payment_id, // payment id
          "received" // order status
        );

        console.log("Order updated succefully!");

        await updateProductStockOnCheckout(payment_id);
        console.log("Item stock updated succefully");
      } catch (err) {
        throw err;
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return;
};

export { createCheckoutSession, webHookEvents };

const updateProductStockOnCheckout = async (payment_id: string) => {
  const getOrderData = `SELECT id FROM orders WHERE payment_id = ?`;

  const [rows] = await db.query<IOrder[]>(getOrderData, [payment_id]);

  const orderID = rows[0].id;

  const orderItems = await getOrderItems(orderID);

  if (orderItems.length === 0) return;

  const productIDs = orderItems.map((item) => item.product_id);

  const caseStatements = orderItems
    .map(() => `WHEN id = ? THEN stock - ?`)
    .join(" ");

  const values = orderItems.flatMap((item) => [item.product_id, item.quantity]);

  const query = `
    UPDATE products
    SET stock = CASE ${caseStatements} 
    END
    WHERE id IN (${[...productIDs]});
  `;

  await db.query(query, values);
};
