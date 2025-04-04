import { OrderCreatedEvent, Publisher, Subjects } from "@ticketly/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
