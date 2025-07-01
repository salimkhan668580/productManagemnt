import asyncWrapper from "../WrapAsync/wrapAsync";
import { Request, Response } from 'express';
import {warehouseSchemaValidation} from "../Zod/ZodSchema";
import Wherehouse from "../Models/Wherehouse";
import { z } from "zod";
import Product from "../Models/Product";
import mongoose from "mongoose";
import { parse } from "path";


export const createWarehouse=  asyncWrapper( async (req: Request, res: Response) => {
    const validateSchema = warehouseSchemaValidation.safeParse(req.body);
   if (!validateSchema.success) {
  throw validateSchema.error; 
}
    const result = new Wherehouse(validateSchema.data);
    await result.save();
    res.status(201).json({
      message: 'Warehouse created successfully',
      data: result
    })

})

export const getAllWarehouses=  asyncWrapper( async (req: Request, res: Response) => {
    const { page=1, limit=10 ,search} = req.query;
    let matchstage:any={};
const pageNumber = parseInt(page as string, 10);
const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const pagaeLimit=parseInt(limit as string, 10);

    if(typeof search === 'string'){
        const searchTerms = search ? search.split(/\s+/) : [];
        

    if (searchTerms.length > 0) {
        matchstage.$or= [
            ...searchTerms.map(term => ({
                $or: [
                  
                  
                    { wareHouseName: { $regex: term, $options: "i" } },
                    { capacity: { $regex: term, $options: "i" } }
                ]
            })).flat()
        ];
    }
    }


    // const warehouses = await Wherehouse.find();
    const warehouses = await Wherehouse.aggregate([
        {
            $match: matchstage
        },
        { $skip:skip  },
        { $limit: pagaeLimit}

    ])

    const totalCount = await Wherehouse.countDocuments(matchstage);
    const totalPages = Math.ceil(totalCount / pagaeLimit);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
   const prevPage = pageNumber > 1 ? pageNumber - 1 : null;
    res.status(200).json({
        message: 'Warehouses retrieved successfully',
        totalPages,
        nextPage,
        prevPage,
        data: warehouses
    });
})


export const updateWarehouse=asyncWrapper( async (req: Request, res: Response) => {
    const { id } = req.query;

    z.string().parse(id);
    if (typeof id !== 'string') {   
        return res.status(400).json({ message: 'Invalid Warehouse ID' });
    }
    
    if (!id) {
        return res.status(400).json({ message: 'Warehouse ID is required' });
    }

    const updatedWarehouse = await Wherehouse.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedWarehouse) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json({
        message: 'Warehouse updated successfully',
        data: updatedWarehouse
    });
})



export const getWarehouseById=asyncWrapper( async (req: Request, res: Response) => {
      const { id } = req.query;
      z.string().parse(id);
    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid Warehouse ID' });
    }
    
    if (!id) {
        return res.status(400).json({ message: 'Warehouse ID is required' });
    }

    const warehouse = await Wherehouse.findById({_id:id});
    if (!warehouse) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json({
        message: 'Warehouse retrieved successfully',
        data: warehouse
    });
});


export const deleteWarehouse=asyncWrapper( async (req: Request, res: Response) => {
    const { id } = req.query;
    z.string().parse(id);
    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid Warehouse ID' });
    }
    
    if (!id) {
        return res.status(400).json({ message: 'Warehouse ID is required' });
    }
    const warehouse = await Wherehouse.findByIdAndDelete(id);
    if (!warehouse) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json({
        message: 'Warehouse deleted successfully',
        data: warehouse
    });
});


export const howmuchProduct=asyncWrapper(async (req: Request, res: Response) => {
        const { page=1, limit=10 ,search,id} = req.query;

    let matchstage:any={};
const pageNumber = parseInt(page as string, 10);
const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const pagaeLimit=parseInt(limit as string, 10);


    z.string().parse(id);
    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid Warehouse ID' });
    }
    
    if (!id) {
        return res.status(400).json({ message: 'Warehouse ID is required' });
    }

      if(typeof search === 'string'){
        const searchTerms = search ? search.split(/\s+/) : [];
        

    if (searchTerms.length > 0) {
        matchstage.$or= [
            ...searchTerms.map(term => ({
                $or: [
                  
                  
                    { productName: { $regex: term, $options: "i" } },
                    { capacity: { $regex: term, $options: "i" } }
                ]
            })).flat()
        ];
    }
    }
    const warehouse = await Wherehouse.findById(id);
    if (!warehouse) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    matchstage.warehouseId=new mongoose.Types.ObjectId(id);

    const howMuchProductAggregation=await Product.aggregate([
        {
            $match: matchstage
        },
        {
     $group: {
      _id: "$productName",
      totalQuantity: { $sum: "$quantity" }
    }
  },
  {
    $project: {
      _id: 0,
      productName: "$_id",
      totalQuantity: 1
    }
  },

  {
    $skip:skip
  },
  {
    $limit:pagaeLimit

  }
           
    ])

    const totalCount = await Product.countDocuments(matchstage);
    const totalPages = Math.ceil(totalCount / pagaeLimit);
    const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
   const prevPage = pageNumber > 1 ? pageNumber - 1 : null;
    res.status(200).json({
        message: 'Warehouse retrieved successfully',
        totalPages,
        currentPage: pageNumber,
        nextPage,
        prevPage,
        data: howMuchProductAggregation
    });
})