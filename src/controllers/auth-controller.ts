import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { PasswordManager } from "../services/password";

export const currentuser = async (req: Request, res: Response) => {
  return res.json({ currentUser: req.currentUser || null });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }

  const passwordMatch = await PasswordManager.compare(
    existingUser.password,
    password
  );

  if (!passwordMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  const userJwt = jwt.sign(
    {
      id: existingUser.id,
    },
    process.env.JWT_SECRET as string
  );

  req.session = {
    jwt: userJwt,
  };

  res.status(200).json(existingUser);
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Email in use");
  }

  const user = User.build({ email, password, name });
  await user.save();

  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string
  );

  req.session = {
    jwt: userJwt,
  };

  res.status(201).json(user);
};
export const logout = async (req: Request, res: Response) => {
  req.session = null;
  return res.json({});
};
