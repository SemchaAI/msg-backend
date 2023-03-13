import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageShema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: "stone",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nickname: {
      type: String,
      required: true,
    },
    emodji: String,
    avatarUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageShema);
