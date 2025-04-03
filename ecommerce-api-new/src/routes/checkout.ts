import express, { json, Router } from "express";
import {
  createCheckoutSession,
  getSessionStatus,
  webHookEvents,
} from "../controllers/paymentController";

const router = Router();

router.post("/create-session", express.json(), createCheckoutSession);

router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  webHookEvents
);

router.get("/session-status", getSessionStatus)

export default router;
