import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  nama_user: String,
  email_user: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'] },
  password: String,
  nomor_telepon: String,
  alamat: String,
  jenis_kelamin: String
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;