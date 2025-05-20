import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

interface IWishList extends Document {
    userId:mongoose.Types.ObjectId,
    products: mongoose.Types.ObjectId[]
}
const wishListSchema = new Schema<IWishList>({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }]
});

export default mongoose.model<IWishList>('WishList', wishListSchema);
