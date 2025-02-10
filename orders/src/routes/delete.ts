import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@ticketly/common";
import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Order } from "../models/order";

const router = Router();

router.delete("/api/orders/:orderId", requireAuth, async (req, res) => {
  const orderId = req.params.orderId;
  if (!isValidObjectId(orderId)) {
    throw new BadRequestError("Invalid order ID");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  } else if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
