import { Ticket } from "../ticket";
import { getMockId } from "../../test/helper/getMockID";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 10,
    userId: getMockId(),
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set("price", 10);
  secondInstance!.set("price", 15);

  await firstInstance!.save();
  try {
    await secondInstance!.save();
  } catch (e) {
    return;
  }
  throw new Error("Sould not reach this error");
});

it("increments version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 10,
    userId: getMockId(),
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
