import mongoose from "mongoose";
const Schema = mongoose.Schema;
const FriendsShema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
});
const UserShema = new Schema(
  {
    nickname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    friends: [FriendsShema],
    avatarUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", UserShema);
