import request from "supertest";
import { app } from "../../app";
import { getMockId } from "../../test/helper/getMockID";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { natsWrapper } from "../../nats-wrapper";

const UPDATE_TICKET_URL = "/api/tickets";
const mockTicket = { title: "test", price: "123" };

it("returns 404 if the provided ticket id does not exist", async () => {
  const id = getMockId();
  await request(app)
    .put(`${UPDATE_TICKET_URL}/${id}`)
    .set("Cookie", [getMockAuthCookie()])
    .send(mockTicket)
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  const id = getMockId();
  await request(app)
    .put(`${UPDATE_TICKET_URL}/${id}`)
    .send(mockTicket)
    .expect(401);
});

it("returns 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", [getMockAuthCookie()])
    .send(mockTicket)
    .expect(201);

  await request(app)
    .put(`${UPDATE_TICKET_URL}/${response.body.id}`)
    .set("Cookie", [getMockAuthCookie()])
    .send(mockTicket)
    .expect(401);
});

it("returns 400 if the user provides an invalid title or price", async () => {
  const authToken = getMockAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", [authToken])
    .send(mockTicket)
    .expect(201);

  await request(app)
    .put(`${UPDATE_TICKET_URL}/${response.body.id}`)
    .set("Cookie", [authToken])
    .send({ title: "", price: 100 })
    .expect(400);

  await request(app)
    .put(`${UPDATE_TICKET_URL}/${response.body.id}`)
    .set("Cookie", [authToken])
    .send({ title: "test", price: -15 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const authToken = getMockAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", [authToken])
    .send(mockTicket)
    .expect(201);

  const updatedTicket = { title: "Test2", price: 45 };
  await request(app)
    .put(`${UPDATE_TICKET_URL}/${response.body.id}`)
    .set("Cookie", [authToken])
    .send(updatedTicket)
    .expect(200);

  const updatedResponse = await request(app)
    .get(`${UPDATE_TICKET_URL}/${response.body.id}`)
    .set("Cookie", [authToken])
    .send()
    .expect(200);

  expect(updatedResponse.body.title).toEqual(updatedTicket.title);
  expect(updatedResponse.body.price).toEqual(updatedTicket.price);
});

it("publishes an event", async () => {
  const authToken = getMockAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", [authToken])
    .send(mockTicket)
    .expect(201);

  const updatedTicket = { title: "Test2", price: 45 };
  await request(app)
    .put(`${UPDATE_TICKET_URL}/${response.body.id}`)
    .set("Cookie", [authToken])
    .send(updatedTicket)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
