import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { getMockId } from "../../test/helper/getMockID";

const NEW_ORDER_URL = "/api/orders";
const TICKET = { id: getMockId(), title: "Concert", price: 15 };

it("returns an error if ticket does not exists", () => {
  const ticketId = new mongoose.Types.ObjectId();
  return request(app)
    .post(NEW_ORDER_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ ticketId })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = Ticket.build(TICKET);
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "abc",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post(NEW_ORDER_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build(TICKET);
  await ticket.save();

  await request(app)
    .post(NEW_ORDER_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ ticketId: ticket.id })
    .expect(201);

  const ordersAfterRequest = await Order.find({}).populate("ticket");
  expect(ordersAfterRequest.length).toEqual(1);
  const [{ ticket: actualTicket }] = ordersAfterRequest;
  expect(actualTicket.id).toEqual(ticket.id);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build(TICKET);
  await ticket.save();

  await request(app)
    .post(NEW_ORDER_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
