import mongoose from "mongoose";
import { Document,Schema } from "mongoose";

interface order extends Document{

    userId: mongoose.Types.ObjectId,
    orderId?:string,
    cartItems:[{
        productId: mongoose.Types.ObjectId,
        quantity:number
    }],
    shippingAddress:{
        street:string,
        city:string,
        state:string,
        zipCode:string,
        country:string

    },
    status: "pending" | "confirmed" | "shipped" | "delivered";

}
const orderSchema=new Schema<order>({
      userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
      orderId:{type:String,required:true},
      cartItems:[
          {
              productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},
              quantity:{type:Number,required:true}
          }
      ],
    shippingAddress:{
       street:String,
        city:String,
        state:String,
        zipCode:String,
        country:String
    }
},{timestamps:true})
export default mongoose.model<order>("Order",orderSchema)