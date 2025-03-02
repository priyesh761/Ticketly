import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { getMockId } from "../../test/helper/getMockID";

const INDEX_URL = "/api/orders";
const TICKET = { title: "Concert", price: 15 };

const buildTicket = async (id: string) => {
  const ticket = Ticket.build({ ...TICKET, id });
  await ticket.save();

  return ticket;
};

it("fetches order for a particular user", async () => {
  const ticket1 = await buildTicket(getMockId());
  const ticket2 = await buildTicket(getMockId());
  const ticket3 = await buildTicket(getMockId());

  const user1 = getMockAuthCookie();
  const user2 = getMockAuthCookie();

  // Setup
  await request(app)
    .post(INDEX_URL)
    .set("Cookie", [user1])
    .send({ ticketId: ticket1.id })
    .expect(201);
  const { body: order1 } = await request(app)
    .post(INDEX_URL)
    .set("Cookie", [user2])
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post(INDEX_URL)
    .set("Cookie", [user2])
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Assert
  const response = await request(app)
    .get(INDEX_URL)
    .set("Cookie", [user2])
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
