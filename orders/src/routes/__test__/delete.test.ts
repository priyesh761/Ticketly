import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { OrderStatus } from "@ticketly/common";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { getMockId } from "../../test/helper/getMockID";

const URL = "/api/orders";
const TICKET = { id: getMockId(), title: "Concert", price: 15 };

it("Marks an order as cancelled", async () => {
  // Setup
  const ticket = Ticket.build(TICKET);
  await ticket.save();

  const user = getMockAuthCookie();
  const { body: order } = await request(app)
    .post(URL)
    .set("Cookie", [user])
    .send({ ticketId: ticket.id })
    .expect(201);

  // Assert
  await request(app)
    .delete(`${URL}/${order.id}`)
    .set("Cookie", [user])
    .send()
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("Emits a order cancelled event", async () => {
  // Setup
  const ticket = Ticket.build(TICKET);
  await ticket.save();

  const user = getMockAuthCookie();
  const { body: order } = await request(app)
    .post(URL)
    .set("Cookie", [user])
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

  await request(app)
    .delete(`${URL}/${order.id}`)
    .set("Cookie", [user])
    .send()
    .expect(204);

  // Assert
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
