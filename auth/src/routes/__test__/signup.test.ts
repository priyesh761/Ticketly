import request from "supertest";
import { app } from "../../app";

const SIGNUP_URL = "/api/users/signup";

it("returns a 201 on successful signup", () => {
  return request(app)
    .post(SIGNUP_URL)
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
});

it("returns a 400 with an invalid email", () => {
  return request(app)
    .post(SIGNUP_URL)
    .send({ email: "invalid-email.com", password: "password" })
    .expect(400);
});

it("returns a 400 with an invalid password", () => {
  return request(app)
    .post(SIGNUP_URL)
    .send({ email: "invalid-email.com", password: "a" })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post(SIGNUP_URL)
    .send({ email: "test@test.com" })
    .expect(400);

  await request(app)
    .post(SIGNUP_URL)
    .send({ password: "password" })
    .expect(400);
});

it("disallows duplicate email", async () => {
  await request(app)
    .post(SIGNUP_URL)
    .send({ email: "test1@test.com", password: "test1" })
    .expect(201);

  await request(app)
    .post(SIGNUP_URL)
    .send({ email: "test1@test.com", password: "test2" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post(SIGNUP_URL)
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
