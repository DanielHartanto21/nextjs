import mongoose from 'mongoose';
const pembayaranSchema = new mongoose.Schema({
  pesanan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pesanan' },
  tanggal_pembayaran: { type: Date, default: Date.now },
  metode_pembayaran: String,

});

const PembayaranlModel = mongoose.models.Payment || mongoose.model('Payment', pembayaranSchema);

export default PembayaranlModel;