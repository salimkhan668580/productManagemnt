
import { Request, Response } from "express";
import asyncWrapper from "../WrapAsync/wrapAsync";
import { Paymentinstance } from "../Payment/PaymentInstance";
import Product from "../Models/Product";
import mongoose from "mongoose";
import crypto from "crypto";
import Order from "../Models/Order";
import { orderSchema } from "../Zod/ZodSchema";

export const createOrder=asyncWrapper( async (req:Request, res:Response) =>{

    const userID=req.user?.id
    
    const Validate = orderSchema.safeParse(req.body);
    if (!Validate.success) {
        throw Validate.error;
    }
    const {cartItems,shippingAddress,status}=req.body;
    const randomString = Math.random().toString(36).substring(2, 10) + (Math.random()*1000000000).toString(36);
    const recipt= `Salim_${randomString}`;

    const productPrice= await Product.aggregate([
        {
            $match: {
                _id: { $in: cartItems.map((item: any) =>  new mongoose.Types.ObjectId(item.productId)) }
            },
        },
         {
    $project: {
      _id: 1,
      price: 1
    }
  }

    ])

  

const totalAmount = productPrice.reduce((total: number, item: any) => {
    const cartItem = cartItems.find((ci: any) => ci.productId === item._id.toString());
  return cartItem ? total + item.price * cartItem.quantity : total;
}, 0);
   
    

const order = await Paymentinstance.orders.create({
amount: totalAmount * 100,
currency: "INR",
receipt: recipt,
})
   const OrderDetails= new Order({
         userId:new mongoose.Types.ObjectId(userID as string),
         cartItems,
         shippingAddress,
         status,
         orderId:order.id
         
     })
     await OrderDetails.save();

    res.status(200).json({
        message: 'Order created successfully',
         order,
         orderId:OrderDetails._id
    });
})

export const verifyPayment = asyncWrapper(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
     const ordermodal = await Order.findOne({ orderId: razorpay_order_id });

    if (!ordermodal) {
    return res.status(404).json({ message: "Order not found" });
    }
  const bulkUpdates = ordermodal.cartItems.map((item: any) => ({
  updateOne: {
    filter: { _id: new mongoose.Types.ObjectId(item.productId) },
    update: { $inc: { productQuantity: -item.quantity } },
  },
}));
 
await Product.bulkWrite(bulkUpdates);
  ordermodal.status = "confirmed";
  await ordermodal.save(); 

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});



