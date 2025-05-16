import asyncWrapper from "../WrapAsync/wrapAsync";
import { Request, Response } from 'express';
import { ProdcutSchema} from "../Zod/ZodSchema";
import Product from "../Models/Product";
import { number, z } from "zod";
import Wherehouse from "../Models/Wherehouse";
import saveActivityLog from "../lib/saveActivity";
import mongoose from "mongoose";

export const createProduct=asyncWrapper( async (req:Request, res:Response) =>{
    const validateSchema=ProdcutSchema.safeParse(req.body);
    if (!validateSchema.success) {
    throw validateSchema.error; 
    }
    const { warehouseId,quantity } = validateSchema.data;
    const warehouse = await Wherehouse.findById(warehouseId);
    if (!warehouse) {
        return res.status(404).json({
            message: 'Warehouse not found',
        });
    }

   if (typeof warehouse.capacity === 'number' && warehouse.capacity > quantity) {

    warehouse.capacity -= quantity;
    await warehouse.save();
    const result = new Product(validateSchema.data);
    await result.save();

    if(req.user?.roles!=='admin'){
    const data={
      userId:new mongoose.Types.ObjectId(req.user?.id as string),
      action: 'create product',
      method: req.method,
      endPoint: req.originalUrl,
      message: 'Product created successfully',
    }
    await saveActivityLog(data);
    }

    res.status(201).json({
        message: 'Product created successfully',
        data: result
    });
   }else{
    return res.status(400).json({
        message: 'Insufficient capacity in the warehouse',
    });
   }
})

export const getAllProducts=asyncWrapper( async (req:Request, res:Response) =>{
    const { long,lat } = req.query;
    
     if (!long || !lat) {
     const products = await Product.find().populate('warehouseId').select('-quantity');
  
     if (!products || products.length === 0) {
        return res.status(404).json({
            message: 'No products found',
            data: null
        });
    }

    // save activity logs
    if(req.user?.roles!=='admin'){
    const data={
      userId:new mongoose.Types.ObjectId(req.user?.id as string),
      action: 'get all products',
      method: req.method,
      endPoint: req.originalUrl,
      message: 'Products fetched successfully',
    }
    await saveActivityLog(data);
    }

     return res.status(200).json({
        message: 'Products fetched successfully',
        data: products
    });
    }

 

    const longNum = Number(long);
    const latNum = Number(lat);
    if (typeof longNum !== 'number' || typeof latNum !== 'number') {
        return res.status(400).json({ message: 'Invalid coordinates' });
    }

  
    // const products = await Product.find({
    //     location: {
    //         $near: {
    //             $geometry: {
    //                 type: 'Point',
    //                 coordinates: [longNum, latNum],
    //             },
    //             $maxDistance: 10000, // 10 km
    //         },
    //     },
    // });
  const productsNearby = await Wherehouse.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [longNum, latNum], 
      },
      distanceField: "distance",
      spherical: true,
      maxDistance: 10000, // 10 km
    },
  },
  {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: 'warehouseId',
      as: 'products',
    },
  },
  {
    $unwind: '$products', 
  },
  {
    $project: {
      productName: '$products.productName',
      price: '$products.price',
     
      description: '$products.description',
      distance: 1,
      wareHouseName: '$wareHouseName',
      warehouseLocation: '$location',
      warehouseCapacity: '$capacity',
    },
  },
]);
   return res.status(200).json({
       message: 'Product fetched successfully',
       data: productsNearby
   });

})

export const getProductById=asyncWrapper( async (req:Request, res:Response) =>{
    const { id } = req.query;
      z.string().parse(id);
    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }
    // save activity logs
    if(req.user?.roles!=='admin'){
    const data={
      userId:new mongoose.Types.ObjectId(req.user?.id as string),
      action: 'get product by id',
      method: req.method,
      endPoint: req.originalUrl,
      message: 'Product fetched successfully',
    }
    await saveActivityLog(data);
    }
    res.status(200).json({
        message: 'Product fetched successfully',
        data: product,
    });

})


export const updateProduct=asyncWrapper( async (req:Request, res:Response) =>{
    const { id } = req.query;
    const validateSchema=ProdcutSchema.safeParse(req.body);
    if (!validateSchema.success) {
    throw validateSchema.error;
    }
      z.string().parse(id);
    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }
    const product = await Product.findByIdAndUpdate(id, validateSchema.data, { new: true });
    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }
    res.status(200).json({
        message: 'Product updated successfully',
        data: product,
    });

})

export const deleteProduct=asyncWrapper( async (req:Request, res:Response) =>{
    const { id } = req.query;
      z.string().parse(id);
    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }
    const warehouse= await Wherehouse.findById(product?.warehouseId);
    if (warehouse&&typeof warehouse.capacity === "number" && typeof product?.quantity === "number") {
        warehouse.capacity += product?.quantity ;
        await warehouse.save();
    }else{
        return res.status(400).json({
            message: 'Invalid warehouse or product quantity',
        });
    }
    res.status(200).json({
        message: 'Product deleted successfully',
    });

})