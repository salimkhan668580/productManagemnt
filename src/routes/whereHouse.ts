// import { createWarehouse, deleteWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse } from "../Controller/wareHouseController";
// import { isLoggedIn } from "../middleware/authMiddleware";
// import { isAdmin } from "../middleware/isAdmin";

// const express = require('express');
// const warehouseRouter = express.Router();

// warehouseRouter.use(isLoggedIn);
// warehouseRouter.use(isAdmin)


// // Create a new warehouse
// warehouseRouter.post('/', createWarehouse);

// // Get all warehouses
// warehouseRouter.get('/', getAllWarehouses);

// // Get a warehouse by ID
// warehouseRouter.get('/single-warehouse', getWarehouseById);

// // Update a warehouse
// warehouseRouter.put('/update', updateWarehouse);
// warehouseRouter.delete('/', deleteWarehouse);

// export default warehouseRouter;


import express from 'express';
import {
  createWarehouse,
  deleteWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
} from '../Controller/wareHouseController';
import { isLoggedIn } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/isAdmin';

const warehouseRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Warehouses
 *   description: APIs for managing warehouses
 */

warehouseRouter.use(isLoggedIn);
warehouseRouter.use(isAdmin);

/**
 * @swagger
 * /api/warehouse:
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouses]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom token from headers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wareHouseName
 *               - capacity
 *               - location
 *             properties:
 *               wareHouseName:
 *                 type: string
 *               capacity:
 *                 type: number
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [77.1234, 28.5678]
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *       400:
 *         description: Invalid input
 */
warehouseRouter.post('/', createWarehouse);

/**
 * @swagger
 * /api/wharehouse:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouses]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all warehouses
 */
warehouseRouter.get('/', getAllWarehouses);

/**
 * @swagger
 * /api/warehouse/single-warehouse:
 *   get:
 *     summary: Get a single warehouse by ID
 *     tags: [Warehouses]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Warehouse found
 *       404:
 *         description: Warehouse not found
 */
warehouseRouter.get('/single-warehouse', getWarehouseById);

/**
 * @swagger
 * /api/warehouse/update:
 *   put:
 *     summary: Update a warehouse
 *     tags: [Warehouses]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               wareHouseName:
 *                 type: string
 *               capacity:
 *                 type: number
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [77.1234, 28.5678]
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *       404:
 *         description: Warehouse not found
 */
warehouseRouter.put('/update', updateWarehouse);

/**
 * @swagger
 * /api/warehouse:
 *   delete:
 *     summary: Delete a warehouse
 *     tags: [Warehouses]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
 *       404:
 *         description: Warehouse not found
 */
warehouseRouter.delete('/', deleteWarehouse);

export default warehouseRouter;
