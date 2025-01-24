import request from "supertest";
import { app } from "../../app";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", [getMockAuthCookie()])
    .send({ title: "test", price: 5 });
};

const INDEX_ROUTE = "/api/tickets";

it("can fetch a list of ticket", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get(INDEX_ROUTE).send().expect(200);
  expect(response.body.length).toEqual(3);
});
