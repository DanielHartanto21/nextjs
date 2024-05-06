import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import UserModel from "../models/user";
import ConnectMongoDB from "../db/db";
import cors from "cors";
import bcrypt from "bcryptjs";
const corsMiddleware = cors();
ConnectMongoDB();
export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const { email_user, password } = req.body;
    console.log(email_user, password)
    try {
      const user = await UserModel.findOne({ email_user });

      if (!user) {
        return res.status(404).json({ message: 'admin tidak ditemukan' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Kata sandi salah' });
      }

      const token = jwt.sign({ id: user._id, email: user.email_user, status: "user" }, 'rahasia');

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan saat proses login' });
    }
  });

}