import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    res.send({ currentUser: null });
    return;
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
