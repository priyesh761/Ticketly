import request from "supertest";
import { app } from "../../app";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { getMockId } from "../../test/helper/getMockID";

const GET_TICKET_URL = "/api/tickets";

it("returns a 404 if the ticket is not found", () => {
  const id = getMockId();
  return request(app).get(`${GET_TICKET_URL}/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "test";
  const price = 10;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", [getMockAuthCookie()])
    .send({ title, price })
    .expect(201);

  const { body: ticket } = response;
  const ticketResponse = await request(app)
    .get(`${GET_TICKET_URL}/${ticket.id}`)
    .set("Cookie", [getMockAuthCookie()])
    .expect(200);
  expect(ticketResponse.body).toEqual(ticket);
});
