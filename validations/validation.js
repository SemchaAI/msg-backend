import { body } from "express-validator";

export const registerValid = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Minimal length is 8 symbols").isLength({ min: 8 }),
  body("nickname", "Minimal length is 3 symbols").isLength({ min: 3 }),
  body("avatarUrl", "Incorrect URL").optional().isURL(),
];

export const loginValid = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Minimal length is 8 symbols").isLength({ min: 8 }),
];
export const messageCreateValid = [
  body("text", "Cannot by empty").isLength({ min: 1 }).isString(),
  //body("viewsCount", "Cannot by empty").isLength({ min: 1 }),
  body("emodji", "Incorrect URL").optional().isURL(),
];
