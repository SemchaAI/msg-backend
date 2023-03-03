import UserModel from "../models/user.js";
import GroupModel from "../models/group.js";
import fs from "fs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      nickname: req.body.nickname,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.TOKEN_ENCRYPT,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot register, verify data",
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Incorrect password or login",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(404).json({
        message: "Incorrect password or login",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.TOKEN_ENCRYPT,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot login, verify data",
    });
  }
};
export const authMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User undefined",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });

    res.json({
      succes: true,
    });
  } catch (error) {}
};
export const authById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.id);

    if (!user) {
      return res.status(404).json({
        message: "User undefined",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });

    res.json({
      succes: true,
    });
  } catch (error) {}
};
export const updAvatar = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.userId, {
      avatarUrl: req.body.url,
    });

    if (!user) {
      return res.status(404).json({
        message: "User undefined",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData });

    // res.json({
    //   succes: true,
    // });
  } catch (error) {
    res.status(500).json({
      message: "Cannot load avatar, verify data",
    });
  }
};
export const delAvatar = async (req, res) => {
  const correctUrl = req.body.linkImg;
  try {
    fs.unlink("." + correctUrl, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not delete the file. " + err,
        });
      }
      res.status(200).send({
        message: "File is deleted.",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: `Cannot delete message, verify connection - ${data}`,
    });
  }
};

export const findOne = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      nickname: req.query.nickname,
    });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect login.",
      });
    }

    res.json({
      ...user._doc,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot login, verify data",
    });
  }
};

export const findRandom = async (req, res) => {
  try {
    let previosID = [req.userId];
    const count = (await UserModel.find()).length;
    let flag = true;
    let randomUsers = [];

    while (flag) {
      const rand = Math.floor(Math.random() * count);
      const user = await UserModel.findOne().skip(rand);
      if (!previosID.includes(String(user._id))) {
        previosID.push(String(user._id));
        randomUsers.push(user);
      }

      if (randomUsers.length === 5) {
        flag = false;
      }
    }

    //const users = await UserModel.findOne().limit(5);
    //const randomUsers = users.sort(() => Math.random() - 0.5);
    return res.status(200).send({
      randomUsers,
      previosID,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot login, verify data",
    });
  }
};

export const addFriend = async (req, res) => {
  try {
    // const me = await UserModel.findById(req.userId);
    const user = await UserModel.findByIdAndUpdate(req.body.id, {
      friendsReq: {
        _id: req.userId,
        nickname: req.body.nickname,
        email: req.body.email,
        avatarUrl: req.body.avatarUrl,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User undefined",
      });
    }

    res.json({ ...user._doc });

    res.json({
      succes: true,
    });
  } catch (error) {}
};
export const removeFriendReq = async (req, res) => {
  try {
    const myId = req.userId;
    const id = req.params.id;

    const user = await UserModel.findOneAndUpdate(
      {
        _id: myId,
      },
      { $pull: { friendsReq: { _id: id } } }
    );
    res.status(200).json({
      message: "succes",
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot delete req, verify connection",
    });
  }
};
export const addFriendReq = async (req, res) => {
  try {
    const myId = req.userId;
    const id = req.params.id;

    const Me = await UserModel.findById(myId);
    console.log(Me);
    const MyFriend = await UserModel.findById(id);

    //   {
    //     _id: myId,
    //   },
    //   {
    //     $push: {
    //       friends: {
    //         $gte: { friendsReq: { _id: id } },
    //         messages: { text: "Hello my friend!", isYou: true },
    //         friendId:id
    //       },
    //     },
    //     $pull: { friendsReq: { _id: id } },
    //   }
    // );
    const doc = new GroupModel({
      chat: [
        {
          text: "Hello my friend!",
          avatarUrl: Me.avatarUrl,
          nickname: Me.nickname,
          user: Me._id,
        },
      ],
      users: [
        {
          _id: myId,
        },
        {
          _id: id,
        },
      ],
    });

    const user = await doc.save();

    const IdGroupToMe = await UserModel.findByIdAndUpdate(myId, {
      $push: {
        friends: {
          _id: user._doc._id,
          avatarUrl: MyFriend._doc.avatarUrl,
          nickname: MyFriend._doc.nickname,
          userId: MyFriend._doc._id,
        },
      },
      $pull: { friendsReq: { _id: id } },
    });
    const WriteIdGroupToFriend = await UserModel.findByIdAndUpdate(id, {
      $push: {
        friends: {
          _id: user._doc._id,
          avatarUrl: Me._doc.avatarUrl,
          nickname: Me._doc.nickname,
          userId: Me._doc._id,
        },
      },
    });
    res.status(200).json({
      ...user._doc,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot delete req, verify connection",
    });
  }
};

export const getGroupChats = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    const groups = await GroupModel.find({ _id: { $in: user.friends } });
    if (!groups) {
      return res.status(404).json({
        message: "Incorrect groups.",
      });
    }

    res.send([...groups]);
  } catch (error) {
    res.status(500).json({
      message: "Cannot find groups, verify data",
    });
  }
};

export const getGroupChat = async (req, res) => {
  try {
    let page = req.params.page;
    const limit = 10;

    const newMessages = await GroupModel.find({
      _id: req.params.id,
    });
    // const temp = await GroupModel.aggregate([
    //   {
    //     $set: {
    //       chat: {
    //         $sortArray: {
    //           input: "$chat",
    //           sortBy: { createdAt: -1 },
    //         },
    //       },
    //     },
    //   },
    // ]);
    // console.log(temp);
    const onlyChat = newMessages[0].chat.slice(0).reverse();

    const pageLimit = Math.ceil(onlyChat.length / limit);
    if (page <= 0) {
      page = 1;
    }
    if (pageLimit < page) {
      page = pageLimit;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const newSortedMessages = onlyChat.slice(startIndex, endIndex);

    res.json(newSortedMessages);
    // const group = await GroupModel.find({ _id: req.params.id });
    // if (!group) {
    //   return res.status(404).json({
    //     message: "Incorrect group.",
    //   });
    // }

    // res.json(...group);
  } catch (error) {
    res.status(500).json({
      message: "Cannot find group, verify data",
    });
  }
};

export const createMessage = async (req, res) => {
  try {
    const user = await GroupModel.findByIdAndUpdate(req.params.id, {
      $push: {
        chat: {
          user: req.userId,
          avatarUrl: req.body.avatarUrl,
          nickname: req.body.nickname,
          text: req.body.text,
        },
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User undefined",
      });
    }
    //res.json({ ...userData });

    res.json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot load msg, verify data",
    });
  }
};
