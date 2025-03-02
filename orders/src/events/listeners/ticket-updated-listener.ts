import { Listener, Subjects, TicketUpdatedEvent } from "@ticketly/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
