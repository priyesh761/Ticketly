import { Router } from "express";

const router = Router();

router.post("/api/users/signin", (_, res) => {
  res.send("get current user");
});

export { router as signinRouter };
