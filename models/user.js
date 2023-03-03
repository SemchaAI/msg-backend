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
    friends: [], //GroupId
    friendsReq: [],
    avatarUrl: String,
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
