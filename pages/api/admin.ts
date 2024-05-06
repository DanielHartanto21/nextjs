import { NextApiRequest, NextApiResponse } from "next";
import { VerifyAdminToken } from "../verify/veriify_admin";
import AdminModel from "../models/admin";
import ConnectMongoDB from "../db/db";
import cors from "cors";
import bcrypt from 'bcryptjs';
const corsMiddleware = cors();


ConnectMongoDB();
export default async function Admin(req: NextApiRequest, res: NextApiResponse) {

  await corsMiddleware(req, res, async () => {
    if (req.method == 'POST') {
      try {
        VerifyAdminToken(req, res, async () => {
          const newAdmin = new AdminModel({
            nama: req.body.nama,
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10),
          });
          const savedAdmin = await newAdmin.save();
          res.status(200).json({ admin: savedAdmin });
        });
      } catch (error) {
        console.error("Error adding new admin:", error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method == 'GET') {
      VerifyAdminToken(req, res, async () => {
        const admin = await AdminModel.find({});
        return res.status(200).json({ admin });
      });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

  });

}