import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/helper/auth-helper";

const CURRENT_USER_URL = "/api/users/currentuser";

it("responds with info about current user", async () => {
  const cookie = await signup();
  const response = await request(app)
    .get(CURRENT_USER_URL)
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app).get(CURRENT_USER_URL).send().expect(200);
  expect(response.body.currentUser).toBeNull();
});
