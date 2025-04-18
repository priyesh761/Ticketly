import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@ticketly/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
