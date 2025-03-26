import { OrderCancelledEvent, OrderStatus } from "@ticketly/common";
import { Ticket } from "../../../models/ticket";
import { getMockId } from "../../../test/helper/getMockID";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: getMockId(),
  });
  ticket.set({ orderId: getMockId() });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: ticket.orderId!,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("updated the ticket, publishes an event, and acks the message", async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
