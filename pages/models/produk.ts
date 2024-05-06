import mongoose from 'mongoose';
const produkSchema = new mongoose.Schema({
  nama_produk: String,
  kategori: String,
  merk: String,
  deskripsi: String,
  harga: Number,
  stok: Number
});

const ProdukModel = mongoose.models.Produk || mongoose.model('Produk', produkSchema);

export default ProdukModel;