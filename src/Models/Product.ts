import mongoose, { Document } from 'mongoose';

interface Product extends Document {
  productName: string;
  price: number;
  quantity: number;
  description: string;
  warehouseId: mongoose.Types.ObjectId;
}

const productSchema = new mongoose.Schema<Product>(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<Product>('Product', productSchema);