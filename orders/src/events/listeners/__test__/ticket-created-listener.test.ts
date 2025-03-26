import { TicketCreatedEvent } from "@ticketly/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { getMockId } from "../../../test/helper/getMockID";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: getMockId(),
    title: "concert",
    price: 12,
    userId: getMockId(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("ack the message", async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
