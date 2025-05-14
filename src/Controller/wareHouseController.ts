import asyncWrapper from "../WrapAsync/wrapAsync";
import { Request, Response } from 'express';
import {warehouseSchemaValidation} from "../Zod/ZodSchema";
import Wherehouse from "../Models/Wherehouse";
import { z } from "zod";


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
    const warehouses = await Wherehouse.find();
    res.status(200).json({
        message: 'Warehouses retrieved successfully',
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