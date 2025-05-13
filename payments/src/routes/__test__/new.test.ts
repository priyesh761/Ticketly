import request from "supertest";
import { app } from "../../app";
import { getMockAuthCookie } from "../../test/helper/getMockAuthCookie";
import { getMockId } from "../../test/helper/getMockID";
import { Order } from "../../models/order";
import { OrderStatus } from "@ticketly/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe.ts");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockAuthCookie())
    .send({
      token: "acafwrdfw",
      orderId: getMockId(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: getMockId(),
    version: 0,
    userId: getMockId(),
    price: 0,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockAuthCookie())
    .send({
      token: "acafwrdfw",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const order = Order.build({
    id: getMockId(),
    version: 0,
    userId: getMockId(),
    price: 0,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockAuthCookie(order.userId))
    .send({
      token: "acafwrdfw",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 204 with valid inputs", async () => {
  const order = Order.build({
    id: getMockId(),
    version: 0,
    userId: getMockId(),
    price: 0,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockAuthCookie(order.userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.currency).toEqual("usd");
  expect(chargeOptions.amount).toEqual(order.price);
  expect(chargeOptions.source).toEqual("tok_visa");

  const stripeId = (
    await (stripe.charges.create as jest.Mock).mock.results[0].value
  ).id;
  expect(stripeId).toBeDefined();
  const payment = await Payment.findOne({ stripeId, orderId: order.id });
  expect(payment).not.toBeNull();
});
