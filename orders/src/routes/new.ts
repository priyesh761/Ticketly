import { Router } from "express";

const router = Router();

router.post("/api/orders", (req, res) => {
  res.send({});
});

export { router as newOrderRouter };
