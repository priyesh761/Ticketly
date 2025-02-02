import { Router } from "express";

const router = Router();

router.get("/api/orders", (req, res) => {
  res.send({});
});

export { router as indexOrderRouter };
