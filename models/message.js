import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageShema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
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
