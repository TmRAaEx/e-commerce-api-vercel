import express, { Router } from "express";
import bodyParser from "body-parser";
import {
  createCheckoutSession,
  getSessionStatus,
  webHookEvents,
} from "../controllers/paymentController";

const router = Router();

router.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  webHookEvents
);

router.post("/create-session", express.json(), createCheckoutSession);

router.get("/session-status", getSessionStatus);

export default router;
