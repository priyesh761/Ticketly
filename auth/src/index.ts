import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
    throw new Error("ENV variables must be defined");
  }
  try {
    console.log("Test Git Hub Action...");
    console.log("Connecting DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB [auth]");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
};

start();
