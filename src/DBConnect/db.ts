import mongoose from 'mongoose';

async function dbConnect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/typeTest');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
export default dbConnect;