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
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete("/api/orders/:orderId", requireAuth, async (req, res) => {
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

  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });
  res.status(204).send(order);
});

export { router as deleteOrderRouter };
