import mongoose, { Document, Schema } from 'mongoose';

interface Warehouse extends Document {
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  productIds: mongoose.Types.ObjectId[];
  wareHouseName: string;
  capacity?: number;
}

const warehouseSchema = new Schema<Warehouse>(
  {
    wareHouseName: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    capacity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for location (required for geospatial queries)
warehouseSchema.index({ location: '2dsphere' });

export default mongoose.model<Warehouse>('Warehouse', warehouseSchema);
