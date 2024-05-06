import { NextApiRequest, NextApiResponse } from "next";
import { VerifyUserToken } from "../verify/veriffy_user";
import UserModel from "../models/user";
import PesananModel from "../models/pesanan";
import DetailModel from "../models/detail";
import ConnectMongoDB from "../db/db";
import cors from "cors";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ProdukModel from "../models/produk";

const corsMiddleware = cors();

interface DecodedUserToken {
  id: string;
  email: string;
  status: string;
}
ConnectMongoDB();
export default async function Pesanan(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, async () => {
    VerifyUserToken(req, res, async () => {
      if (req.method == 'POST') {
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        try {
          const decoded = jwt.verify(token, 'rahasia') as DecodedUserToken;
          const userId = decoded.id;
          const total_harga = req.body.total_harga;
          const items = req.body.items;
          const newPesanan = new PesananModel({
            user_id: userId,
            total_harga: total_harga,
            status: 'pending',
            tanggal: Date.now(),
          });

          const savedPesanan = await newPesanan.save();

          for (const item of items) {
            const product = await ProdukModel.findById(item._id);
            if (!product) {
              return res.status(404).json({ message: 'Product not found' });
            }

            if (item.jumlah > product.stok) {
              return res.status(400).json({ message: 'Insufficient stock for product ' + product.nama_produk });
            }

            product.stok -= item.jumlah;
            await product.save();

            const newDetail = new DetailModel({
              pesanan_id: savedPesanan._id,
              produk_id: item._id,
              jumlah: item.jumlah,
              harga: item.totalHarga,
            });
            console.log(newDetail);
            await newDetail.save();
          }
          return res.status(200).json({ savedPesanan });
        } catch (error) {
          console.error("Error adding new user:", error);
          return res.status(500).json({ message: 'Internal server error' });
        }


      }
      else if (req.method == 'GET') {
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
            const decoded = jwt.verify(token, 'rahasia') as DecodedUserToken;
            const userId = decoded.id;
            const pesanan = await PesananModel.find({ user_id: userId });
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