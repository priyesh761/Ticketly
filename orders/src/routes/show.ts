import { Router } from "express";

const router = Router();

router.get("/api/orders/:orderId", (req, res) => {
  res.send({});
});

export { router as showOrderRouter };
