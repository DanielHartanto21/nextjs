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

    if (req.method == 'POST') {
      try {
        console.log(req.body);
        const newUser = new UserModel({
          nama_user: req.body.nama_user,
          email_user: req.body.email_user,
          password: await bcrypt.hash(req.body.password, 10),
          nomor_telepon: req.body.nomor_telepon,
          alamat: req.body.alamat,
          jenis_kelamin: req.body.jenis_kelamin
        });
        const savedUser = await newUser.save();
        return res.status(200).json({ User: savedUser });
      } catch (error) {
        console.error("Error adding new user:", error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method == 'GET') {
      VerifyUserToken(req, res, async () => {
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        try {
          const decoded = jwt.verify(token, 'rahasia') as DecodedToken;
          const userId = decoded.id;
          const user = await UserModel.findOne({ _id: userId });
          return res.status(200).json({ User: user });
        }
        catch (error) {
          console.error("Cannot find user:", error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
    } else if (req.method == 'PUT') {
      VerifyUserToken(req, res, async () => {
        const _id = req.body.data._id;
        const nama_user = req.body.data.nama_user;
        const email_user = req.body.data.email_user;
        const nomor_telepon = req.body.data.nomor_telepon;
        const alamat = req.body.data.alamat;
        const jenis_kelamin = req.body.data.jenis_kelamin;
        const updatedData = await UserModel.findByIdAndUpdate(_id, { nama_user, email_user, nomor_telepon, alamat, jenis_kelamin }, { new: true });
        if (!updatedData) {
          return res.status(404).json({ message: 'produk not found' });
        }
        return res.status(200).json({ updatedData });
      });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

  });

}