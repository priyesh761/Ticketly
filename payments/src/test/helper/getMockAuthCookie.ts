import JWT from "jsonwebtoken";
import { getMockId } from "./getMockID";

export const getMockAuthCookie = (id?: string) => {
  // Build a JWT payload
  const payload = {
    id: id ?? getMockId(),
    email: "test@test.com",
  };

  // Create a JWT
  const token = JWT.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn the session into json
  const sessionJson = JSON.stringify(session);

  // Take json and encode it as base64 (serialization done by session-cookie middleware)
  const base64 = Buffer.from(sessionJson).toString("base64");

  // returns a string thats the cookie that session-cookie expects
  return `session=${base64}`;
};
