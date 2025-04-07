import mongoose from "mongoose";

export const getMockId = () => new mongoose.Types.ObjectId().toHexString();
