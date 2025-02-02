import { Router } from "express";

const router = Router();

router.delete("/api/orders/:orderId", (req, res) => {
  res.send({});
});

export { router as deleteOrderRouter };
