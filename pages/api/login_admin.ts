import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import AdminModel from "../models/admin";
import ConnectMongoDB from "../db/db";
import cors from "cors";
import bcrypt from "bcryptjs";
const corsMiddleware = cors();
ConnectMongoDB();
export default async function LoginAdmin(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, async () => {
    if (req.method == 'POST') {
      const { username, password } = req.body;
      console.log(username, password);
      try {
        const admin = await AdminModel.findOne({ username });

        if (!admin) {
          return res.status(404).json({ message: 'admin tidak ditemukan' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Kata sandi salah' });
        }

        const token = jwt.sign({ id: admin._id, email: admin.username, status: "admin" }, 'rahasia');

        res.status(200).json({ token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat proses login' });
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

  });

}