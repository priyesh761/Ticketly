import request from "supertest";
import { app } from "../../app";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { Ticket } from "../../models/ticket";

const CREATE_TICKET_URL = "/api/tickets";

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post(CREATE_TICKET_URL).send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", () => {
  return request(app).post(CREATE_TICKET_URL).send({}).expect(401);
});

it("return status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post(CREATE_TICKET_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post(CREATE_TICKET_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post(CREATE_TICKET_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ price: 10 })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post(CREATE_TICKET_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ title: "test", price: -10 })
    .expect(400);

  await request(app)
    .post(CREATE_TICKET_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ title: "test" })
    .expect(400);
});

it("create a ticket with valid inputs", async () => {
  // Add in a check to make sure a ticket was saved
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post(CREATE_TICKET_URL)
    .set("Cookie", [getMockAuthCookie()])
    .send({ title: "test", price: 5 })
    .expect(201);
  const ticketsAfterRequest = await Ticket.find({});
  expect(ticketsAfterRequest.length).toEqual(1);
  const [{ title, price }] = ticketsAfterRequest;
  expect(title).toEqual("test");
  expect(price).toEqual(5);
});
