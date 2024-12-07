import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 5, max: 10 }).withMessage("Password must be between 5 and 10 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
      return;
    }
    const { email, password } = req.body;

    res.status(201).send(`Creating a user - ${email} ${password}`);
  }
);

export { router as signupRouter };
