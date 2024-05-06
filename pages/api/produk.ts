import { NextApiRequest, NextApiResponse } from "next";
import { VerifyAdminToken } from "../verify/veriify_admin";
import ProdukModel from "../models/produk";
import ConnectMongoDB from "../db/db";
import cors from "cors";
const corsMiddleware = cors();

ConnectMongoDB();
export default async function InputProduk(req: NextApiRequest, res: NextApiResponse) {

  await corsMiddleware(req, res, async () => {
    if (req.method == 'POST') {
      try {
        VerifyAdminToken(req, res, async () => {
          console.log(req.body);
          const newProduk = new ProdukModel({
            nama_produk: req.body.nama_produk,
            kategori: req.body.kategori,
            merk: req.body.merk,
            deskripsi: req.body.deskripsi,
            harga: req.body.harga,
            stok: req.body.stok
          });
          const savedProduk = await newProduk.save();
          console.log(newProduk);
          res.status(200).json({ produk: savedProduk });
        });
      } catch (error) {
        console.error("Error adding new admin:", error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method == 'PUT') {
      VerifyAdminToken(req, res, async () => {
        const _id = req.body.data._id;
        const nama_produk = req.body.data.nama_produk;
        const kategori = req.body.data.kategori;
        const merk = req.body.data.merk;
        const deskripsi = req.body.data.deskripsi;
        const harga = req.body.data.harga;
        const stok = req.body.data.stok;
        const updatedProduk = await ProdukModel.findByIdAndUpdate(_id, { nama_produk, kategori, merk, deskripsi, harga, stok }, { new: true });
        if (!updatedProduk) {
          return res.status(404).json({ message: 'produk not found' });
        }
        return res.status(200).json({ updatedProduk });
      });
    } else if (req.method == 'GET') {
      if (req.query.id) {
        const produk = await ProdukModel.findOne({ _id: req.query.id });
        res.status(200).json({ produk });
      } else {
        const produk = await ProdukModel.find({});
        res.status(200).json({ produk });
      }
    } else if(req.method=='PATCH'){
      VerifyAdminToken(req, res, async () => {
        const _id = req.body.id;
        const jumlah = req.body.jumlah;
        const product = await ProdukModel.findById(_id);
        product.stok +=jumlah;
        
        await product.save();
        return res.status(200).json({ product });
      });
    }else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  }

  );

}