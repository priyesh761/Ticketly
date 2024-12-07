import { Router } from "express";

const router = Router();

router.get("/api/users/currentuser", (_, res) => {
  res.send("get current user");
});

export { router as currentUserRouter };
