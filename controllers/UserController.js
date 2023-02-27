import UserModel from "../models/user.js";
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
