import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/helper/auth-helper";

const SINGIN_URL = "/api/users/signin";

it("fails when an email that doesnot exist is supplied", () => {
  return request(app)
    .post(SINGIN_URL)
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await signup();

  await request(app)
    .post(SINGIN_URL)
    .send({ email: "test@test.com", password: "password2" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await signup();

  const response = await request(app)
    .post(SINGIN_URL)
    .send({ email: "test@test.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
