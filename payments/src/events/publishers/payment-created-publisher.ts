import { Publisher, PaymentCreatedEvent, Subjects } from "@ticketly/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
