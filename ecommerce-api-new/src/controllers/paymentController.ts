import { Request, Response } from "express";
import dotenv from "dotenv";
import { logError } from "../utilities/logger";

dotenv.config();
import * as stripeService from "../services/stripeService";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { items, orderID } = req.body;

  try {
    const clientSecret = await stripeService.createCheckoutSession(
      items,
      orderID,
      stripe
    );

    res.send({ clientSecret: clientSecret });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const getSessionStatus = async (req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details.email,
  });
};

export const webHookEvents = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  console.log("request",req)  
  console.log("sig",signature);
  

  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.log("baaaaaaaaaaaaaaaaaa")
    res.status(400).send(`Webhook Error: ${logError(err)}`);
    throw err;
  }

  try {
    await stripeService.webHookEvents(event);
  } catch (err) {
    res.status(500).json({ message: logError(err) });
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
