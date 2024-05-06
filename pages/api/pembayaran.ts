import { NextApiRequest, NextApiResponse } from "next";
import { VerifyUserToken } from "../verify/veriffy_user";
import PembayaranlModel from "../models/pembayaran";
import ConnectMongoDB from "../db/db";
import cors from "cors";
import PesananModel from "../models/pesanan";

const corsMiddleware = cors();

ConnectMongoDB();
export default async function Pembayaran(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, async () => {
    VerifyUserToken(req, res, async () => {
      if (req.method == 'POST') {
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        console.log(req.headers.authorization);
        console.log(req.body);

        try {
          const pesanan_id = req.body.pesanan_id;
          const metode_pembayaran = req.body.metode_pembayaran;
          if (metode_pembayaran !== "") {
            console.log("pembayaran ada");
            const newPembayaran = new PembayaranlModel({
              pesanan_id: pesanan_id,
              metode_pembayaran: metode_pembayaran
            });

            const savedPembayaran = await newPembayaran.save();
            const pesanan = await PesananModel.findById(pesanan_id);
            pesanan.status = "Lunas";
            await pesanan.save();
            return res.status(200).json({});
          } else {
            console.log("not select payment");
            return res.status(401).json({ message: 'Select Payment' });
          }

        } catch (error) {
          console.error("Error adding new user:", error);
          return res.status(500).json({ message: 'Internal server error' });
        }


      }

    });
  });

}