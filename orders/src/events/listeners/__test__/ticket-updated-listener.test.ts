import { TicketUpdatedEvent } from "@ticketly/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { getMockId } from "../../../test/helper/getMockID";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: getMockId(),
    title: "test",
    price: 10,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "concert",
    price: 18,
    userId: "hvuig",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("finds, updates and saves a ticket", async () => {
  const { data, msg, listener, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if event has a skipped version number", async () => {
  const { data, msg, listener, ticket } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err: any) {
    expect(err?.message).toEqual("Ticket not found");
  }
  expect(msg.ack).not.toHaveBeenCalled();
});
