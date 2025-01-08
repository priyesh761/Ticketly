import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/helper/auth-helper";

const SINGOUT_URL = "/api/users/signout";

it("clears the cookie after signing out", async () => {
  await signup();

  const response = await request(app).post(SINGOUT_URL).send({}).expect(200);
  const cookie = response.get("Set-Cookie");
  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }

  expect(cookie[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
