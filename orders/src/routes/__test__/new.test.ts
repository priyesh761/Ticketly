import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

const NEW_ORDER_URL = "/api/orders";

it("returns an error if ticket does not exists", () => {
  const ticketId = new mongoose.Types.ObjectId();
  return request(app)
    .post(NEW_ORDER_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ ticketId })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = Ticket.build({ title: "Concert", price: 10 });
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
  const ticket = Ticket.build({ title: "Concert", price: 20 });
  await ticket.save();

  const response = await request(app)
    .post(NEW_ORDER_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ ticketId: ticket.id })
    .expect(201);

  const ordersAfterRequest = await Order.find({}).populate("ticket");
  expect(ordersAfterRequest.length).toEqual(1);
  const [{ ticket: actualTicket }] = ordersAfterRequest;
  expect(actualTicket.id).toEqual(ticket.id);
});

it.todo("emits an order created event");
