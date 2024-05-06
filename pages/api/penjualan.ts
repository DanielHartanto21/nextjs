import { NextApiRequest, NextApiResponse } from "next";
import { VerifyAdminToken } from "../verify/veriify_admin";
import PesananModel from "../models/pesanan";
import DetailModel from "../models/detail";
import ConnectMongoDB from "../db/db";
import cors from "cors";

const corsMiddleware = cors();

ConnectMongoDB();
export default async function Penjualan(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, async () => {
    VerifyAdminToken(req, res, async () => {
      if (req.method == 'GET') {
        if (req.query.id) {
          try {
            const id = req.query.id;
            const detail = await DetailModel.find({ pesanan_id: id }).populate({ path: 'produk_id' });
            const pesanan = await PesananModel.findOne({ _id: id }).populate({ path: "user_id" });
            return res.status(200).json({ detail, pesanan });
          } catch (error) {
            console.error("Error adding new user:", error);
            return res.status(500).json({ message: 'Internal server error' });
          }
        } else {
          const token = req.headers.authorization;
          if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
          }
          try {
            const pesanan = await PesananModel.find({ status: "Lunas" }).populate({ path: "user_id" });
            return res.status(200).json({ pesanan });
          } catch (error) {
            console.error("Error adding new user:", error);
            return res.status(500).json({ message: 'Internal server error' });
          }
        }

      }
    });

  });

}