import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB conectado correctamente");
  } catch {
    console.error('No se pudo establecer la conexión con MongoDB');
    process.exit(1);
  }
};

export default connectDB;
