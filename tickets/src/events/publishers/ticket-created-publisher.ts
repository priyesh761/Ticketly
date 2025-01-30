import { Publisher, Subjects, TicketCreatedEvent } from "@ticketly/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
