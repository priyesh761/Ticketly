import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketly/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
