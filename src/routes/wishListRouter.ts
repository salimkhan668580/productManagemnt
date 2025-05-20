import express from 'express';
import { getWishList, addToWishList, removeFromWishList } from '../Controller/wishListController';
import { isLoggedIn } from '../middleware/authMiddleware';

const wishListRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: APIs for managing wishlists
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product added to the wishlist
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/wishlist/remove:
 *   post:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from the wishlist
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
wishListRouter.use(isLoggedIn);

wishListRouter.get('/', getWishList);
wishListRouter.post('/add', addToWishList);
wishListRouter.post('/remove', removeFromWishList);

export default wishListRouter;

