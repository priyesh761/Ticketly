import { requireAuth, validateRequest } from "@ticketly/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const newticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await newticket.save();

    res.status(201).send(newticket);
  }
);

export { router as createTicketRouter };
