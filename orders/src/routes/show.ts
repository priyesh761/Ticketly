import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@ticketly/common";
import { Router } from "express";
import { Order } from "../models/order";
import { isValidObjectId } from "mongoose";

const router = Router();

router.get("/api/orders/:orderId", requireAuth, async (req, res) => {
  const orderId = req.params.orderId;
  if (!isValidObjectId(orderId)) {
    throw new BadRequestError("Invalid order ID");
  }

  const order = await Order.findById(orderId).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  } else if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
