import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import {
  loginValid,
  registerValid,
  messageCreateValid,
} from "./validations/validation.js";

import {
  authMe,
  login,
  register,
  create,
  getAll,
  getOne,
  remove,
  update,
  updAvatar,
  delAvatar,
  authById,
  updateAvatars,
  findOne,
  findRandom,
  addFriend,
  removeFriendReq,
  addFriendReq,
  getGroupChat,
  getGroupChats,
  createMessage,
  updStatus,
  deleteFriend,
} from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

//CONFIGS-----------------------------------------

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(cors());

app.use(express.json());
app.use("/uploads/", express.static("uploads"));

mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URI)
  .then((res) => console.log("Connected to db"))
  .catch((err) => console.log("Cannot connect to db"));

//REQ RES----------------------------------------

app.post("/auth/login", loginValid, handleValidationErrors, login);
app.post("/auth/register", registerValid, handleValidationErrors, register);
app.get("/auth/me", checkAuth, authMe);
app.get("/auth/user/:id", checkAuth, authById);
app.put("/user/avatar", checkAuth, updAvatar);
app.put("/user/status", checkAuth, updStatus);

app.post("/user/update/avatars", checkAuth, updateAvatars);

app.post(
  "/user/upload/avatar",
  checkAuth,
  upload.single("image"),
  (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  }
);
app.post("/user/delete/avatar", checkAuth, delAvatar);

app.get("/find/user", checkAuth, findOne);
app.get("/find/random", checkAuth, findRandom);
app.post("/add/friend", checkAuth, addFriend);
app.put("/delete/friendReq/:id", checkAuth, removeFriendReq);
app.put("/delete/friend/:id", checkAuth, deleteFriend);
app.put("/add/friendReq/:id", checkAuth, addFriendReq);
app.get("/group/chats", checkAuth, getGroupChats);
app.get("/group/chat/:id/:userId/:page", checkAuth, getGroupChat);
app.post("/group/chat/message/:id", checkAuth, createMessage);

//////////////////////////////////

app.get("/message", checkAuth, getAll);
app.get("/message/:id", checkAuth, getOne);
app.post(
  "/message",
  checkAuth,
  messageCreateValid,
  handleValidationErrors,
  create
);
app.delete("/message/:id", checkAuth, remove);
app.patch(
  "/message/:id",
  checkAuth,
  messageCreateValid,
  handleValidationErrors,
  update
);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(reportError);
  }
  console.log("Server started");
});
