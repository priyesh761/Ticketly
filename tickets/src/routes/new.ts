import { requireAuth, validateRequest } from "@ticketly/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newticket.id,
      title: newticket.title,
      price: newticket.price,
      userId: newticket.userId,
      version: newticket.version,
    });
    res.status(201).send(newticket);
  }
);

export { router as createTicketRouter };
