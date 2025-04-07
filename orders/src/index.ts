import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

const KEYS = [
  "JWT_KEY",
  "MONGO_URI",
  "NATS_URL",
  "NATS_CLUSTER_ID",
  "NATS_CLIENT_ID",
];

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

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    console.log("Connecting DB...");
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB [orders]");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
};

start();
