import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { getMockId } from "../../test/helper/getMockID";

const URL = "/api/orders";
const TICKET = { id: getMockId(), title: "Concert", price: 15 };

it("fetches the order", async () => {
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
  const { body: actualOrder } = await request(app)
    .get(`${URL}/${order.id}`)
    .set("Cookie", [user])
    .send()
    .expect(200);

  expect(actualOrder.id).toEqual(order.id);
});

it("Returns an error if order does not belong to user", async () => {
  // Setup
  const ticket = Ticket.build(TICKET);
  await ticket.save();

  const { body: order } = await request(app)
    .post(URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ ticketId: ticket.id })
    .expect(201);

  // Assert
  await request(app)
    .get(`${URL}/${order.id}`)
    .set("Cookie", [getMockAuthCookie()])
    .send()
    .expect(401);
});
