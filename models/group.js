import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageShema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nickname: {
      type: String,
      ref: "User",
    },
    gender: {
      type: String,
      default: "stone",
      ref: "User",
    },
    saw: {
      type: Boolean,
      default: false,
    },
    avatarUrl: String,
  },
  { timestamps: true }
);

const GroupShema = new Schema({
  chat: [MessageShema],
  users: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

export default mongoose.model("Group", GroupShema);
