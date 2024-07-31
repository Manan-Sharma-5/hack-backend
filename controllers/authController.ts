import { Request, Response } from "express";
import { User } from "../interface/BasicUser";
import { db } from "../dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    if (!user.email || !user.name || !user.password || !user.username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);

    const createdUser = await db.user.create({ data: user });

    const token = jwt.sign(
      { id: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    db.user
      .findUnique({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || "secret",
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({ token });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
