import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface Payload {
  id: string;
  phone_number: string;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .send({ message: "No auth token found. Authorization denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Payload;

    if (!decoded.id) {
      return res
        .status(401)
        .send({ message: "Token verification failed. Authorization denied." });
    }

    req.userId = decoded.id;
    next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default verifyToken;
