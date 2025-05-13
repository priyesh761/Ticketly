import { getMockId } from "../test/helper/getMockID";

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: getMockId() }),
  },
};
