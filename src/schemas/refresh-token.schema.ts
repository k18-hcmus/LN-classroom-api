import { RefreshTokenModel } from "@models/refresh-token.model";
import mongoose, { Schema } from "mongoose";

const RefreshTokenSchema: Schema = new Schema({
  token: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

export default mongoose.model<RefreshTokenModel>(
  "refresh-tokens",
  RefreshTokenSchema
);
