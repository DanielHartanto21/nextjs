import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import UserModel from "../models/user";

interface DecodedUserToken {
  id: string;
  email: string;
  status: string;
}
export const VerifyUserToken = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {

    const decoded = jwt.verify(token, 'rahasia') as DecodedUserToken;
    const userId = decoded.id;
    const email = decoded.email;
    const user = await UserModel.findOne({ email_user: email });
    const userValid = await userId == user._id;
    if (userValid == true) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: No token wrong' });
    }

  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
