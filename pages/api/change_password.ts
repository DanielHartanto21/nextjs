import { NextApiRequest, NextApiResponse } from "next";
import { VerifyUserToken } from "../verify/veriffy_user";
import UserModel from "../models/user";
import ConnectMongoDB from "../db/db";
import cors from "cors";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const corsMiddleware = cors();

interface DecodedToken {
  id: string;
  email: string;
  status: string;
}

ConnectMongoDB();
export default async function User(req: NextApiRequest, res: NextApiResponse) {

  await corsMiddleware(req, res, async () => {

    if (req.method == 'PUT') {
      VerifyUserToken(req, res, async () => {
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        try {
          const decoded = jwt.verify(token, 'rahasia') as DecodedToken;
          const _id = decoded.id;
          const user = await UserModel.findOne({ _id });
          const password = req.body.password;
          const newPassword = await bcrypt.hash(req.body.new_password, 10);
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            const updatedData = await UserModel.findByIdAndUpdate(_id, { password: newPassword }, { new: true });
            if (!updatedData) {
              return res.status(404).json({ message: 'produk not found' });
            }
            return res.status(200).json({ updatedData });
          } else {
            res.status(403).json({ message: 'wrong old password ' });
          }

        }
        catch (error) {
          console.error("Cannot find user:", error);
          res.status(500).json({ message: 'Internal server error' });
        }

      });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

  });

}