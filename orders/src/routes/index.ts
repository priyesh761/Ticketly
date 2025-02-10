import { requireAuth } from "@ticketly/common";
import { Router } from "express";
import { Order } from "../models/order";

const router = Router();

router.get("/api/orders", requireAuth, async (req, res) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");
  res.send(orders);
});

export { router as indexOrderRouter };
