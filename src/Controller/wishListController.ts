import asyncWrapper from "../WrapAsync/wrapAsync";
import { Request, Response } from 'express';
import Wishlist from "../Models/WishList";
import Product from "../Models/Product";
import mongoose from "mongoose";


export const getWishList=asyncWrapper(async (req:Request, res:Response) => {
    const userId=req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: You must be logged in" });
    }
    const wishlist = await Wishlist.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('products');
    res.status(200).json({
        message: "Wishlist fetched successfully",
        data: wishlist
    })
});

 export const addToWishList=asyncWrapper(async (req:Request, res:Response) => {
    const {productId}=req.body;
    const userId=req.user?.id;
    if (!productId || !userId) {
        return res.status(400).json({ message: "Bad Request: Product ID and User ID are required" });
    }
    const product=await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    const wishlist=await Wishlist.findOneAndUpdate({userId:new mongoose.Types.ObjectId(userId)},{$addToSet:{products:new mongoose.Types.ObjectId(productId)}},{new:true,upsert:true});
    res.status(201).json(wishlist);
});

export const removeFromWishList=asyncWrapper(async (req:Request, res:Response) => {
    const {productId}=req.body;
    const userId=req.user?.id;
    if (!productId || !userId) {
        return res.status(400).json({ message: "Bad Request: Product ID and User ID are required" });
    }
    const wishlist=await Wishlist.findOneAndUpdate({userId:new mongoose.Types.ObjectId(userId)},{$pull:{products:new mongoose.Types.ObjectId(productId)}},{new:true});
    res.status(200).json(wishlist);
});
