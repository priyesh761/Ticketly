import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
    throw new Error("ENV variables must be defined");
  }
  try {
    await natsWrapper.connect("ticketly", "tsts", "https://nats-srv:4222");
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    console.log("Connecting DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB [tickets]");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
};

start();
