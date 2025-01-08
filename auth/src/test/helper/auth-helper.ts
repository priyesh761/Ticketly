import request from "supertest";
import { app } from "../../app";

const SIGNUP_URL = "/api/users/signup";

export const signup = async (
  email: string = "test@test.com",
  password: string = "password"
) => {
  const response = await request(app)
    .post(SIGNUP_URL)
    .send({ email, password })
    .expect(201);
  const cookie = response.get("Set-Cookie");
  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }

  return cookie;
};
