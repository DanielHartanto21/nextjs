import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  nama: String,
  username: { type: String, unique: true },
  password: String
});

const AdminModel = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default AdminModel;