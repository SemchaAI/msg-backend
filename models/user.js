import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
    gender: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "smile pls",
      required: true,
    },
    friends: [], //GroupId
    friendsReq: [],
    avatarUrl: {
      type: String,
      required: true,
      default: "/uploads/avatar.svg",
    },
  },
  { timestamps: true }
);

// const GroupMessages = new Schema({
//   GroupId: {
//     type: String,
//     required: true,
//   },
//   Message: {
//     type: String,
//     required: true,
//   },
//   User: [
//     UserShema.nickname,
//     UserShema.email,
//     UserShema.avatarUrl,
//     UserShema._id,
//   ],
// });
export default mongoose.model("User", UserShema);
