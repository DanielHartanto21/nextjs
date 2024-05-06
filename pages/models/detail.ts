import mongoose from 'mongoose';
const detailSchema = new mongoose.Schema({
  pesanan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pesanan' },
  produk_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk' },
  jumlah: Number,
  harga: Number
});

const DetailModel = mongoose.models.Detail || mongoose.model('Detail', detailSchema);

export default DetailModel;