import express, { json } from "express";

const app = express();
app.use(json());

app.get("/api/users/currentuser", (_, res) => {
  res.send("get current user");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
