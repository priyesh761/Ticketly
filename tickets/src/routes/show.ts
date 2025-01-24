import { NotFoundError } from "@ticketly/common";
import { Router } from "express";
import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets/:id", async (req, res) => {
  const ticketId = req.params.id;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
