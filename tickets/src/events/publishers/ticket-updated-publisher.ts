import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketly/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
