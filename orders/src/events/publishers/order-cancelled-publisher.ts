import { OrderCancelledEvent, Publisher, Subjects } from "@ticketly/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
