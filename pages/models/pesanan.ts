import mongoose from 'mongoose';
const pesananSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tanggal: { type: Date, default: Date.now },
  total_harga: Number,
  status: String
});

const PesananModel = mongoose.models.Pesanan || mongoose.model('Pesanan', pesananSchema);

export default PesananModel;