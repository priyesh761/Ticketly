import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const KEYS = ["NATS_URL", "NATS_CLUSTER_ID", "NATS_CLIENT_ID"];

const start = async () => {
  if (!KEYS.every((key) => process.env[key])) {
    throw new Error("ENV variables must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
