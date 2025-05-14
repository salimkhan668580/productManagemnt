// const express= require('express');

// import { getAllProducts, createProduct,getProductById,updateProduct,deleteProduct } from "../Controller/productController";
// import { isLoggedIn } from "../middleware/authMiddleware";

// import { isAdmin } from "../middleware/isAdmin";

// const productRouter = express.Router();

// productRouter.use(isLoggedIn);



// productRouter.post('/', createProduct);

// productRouter.get('/', getAllProducts);

// productRouter.get('/single-product', getProductById);


// productRouter.use(isAdmin);
// productRouter.put('/update', updateProduct);
// productRouter.delete('/', deleteProduct);



// export default productRouter;


import express from 'express';
import { Request, Response } from 'express';

import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../Controller/productController";
import { isLoggedIn } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/isAdmin";

const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: APIs for managing products
 */

productRouter.use(isLoggedIn);

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom token in headers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - price
 *               - quantity
 *               - description
 *             properties:
 *               productName:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized - token missing or invalid
 */
productRouter.post('/', createProduct);

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom token in headers
 *     responses:
 *       200:
 *         description: List of all products
 */
productRouter.get('/', getAllProducts);

/**
 * @swagger
 * /api/product/single-product:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
productRouter.get('/single-product', getProductById);

// Middleware for admin-only routes
productRouter.use(isAdmin);

/**
 * @swagger
 * /api/product/update:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *               productName:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
productRouter.put('/update', updateProduct);

/**
 * @swagger
 * /api/product:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
productRouter.delete('/', deleteProduct);

export default productRouter;



