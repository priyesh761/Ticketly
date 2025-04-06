import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@ticketly/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { expirationQueue } from "../../src/queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - Date.now();
    console.log(
      `Waiting for ${delay} ms to process order with id - ${data.id}`
    );
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
