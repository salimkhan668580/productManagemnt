import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  roles: string;
  location:{
    type: 'Point',
    coordinates: [number, number]; // [longitude, latitude]
  }
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
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
  },
  { timestamps: true }
);

userSchema.pre<User>('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (err: any) {
    // Handle any errors that occur during hashing
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err: any) {
    throw new Error('Error comparing passwords');
  }
};

export default mongoose.model<User>('User', userSchema);