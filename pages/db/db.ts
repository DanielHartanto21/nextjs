const uri = "mongodb+srv://danielhartanto70:Daniel123@cluster0.egcb6rq.mongodb.net/?retryWrites=true&w=majority&appName=cluster0/laundry";
import mongoose from "mongoose";

const ConnectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log(error);
  }
};

export default ConnectMongoDB;