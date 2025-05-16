import express from 'express';
import { getActivityLogs, deleteById, deleteAll } from '../Controller/activityController';
import { isLoggedIn } from '../middleware/authMiddleware';

const activityLogRouter = express.Router();
activityLogRouter.use(isLoggedIn);

/**
 * @swagger
 * /api/activity-log:
 *   get:
 *     summary: Get all activity logs
 *     tags: [Activity Logs]
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityLog'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
activityLogRouter.get('/', getActivityLogs);

/**
 * @swagger
 * /api/activity-log/delete:
 *   delete:
 *     summary: Delete an activity log by ID
 *     tags: [Activity Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logId:
 *                 type: string
 *                 example: "64ac98a3f9e2c1b23d8f4f12"
 *     responses:
 *       200:
 *         description: Activity Log deleted successfully
 *       400:
 *         description: Log ID is required
 *       404:
 *         description: Activity Log not found
 *       403:
 *         description: Forbidden: You can't delete others' logs
 */
activityLogRouter.delete('/delete', deleteById);

/**
 * @swagger
 * /api/activity-log/deleteAll:
 *   delete:
 *     summary: Delete all activity logs for the current user
 *     tags: [Activity Logs]
 *     responses:
 *       200:
 *         description: Activity Logs deleted successfully
 *       403:
 *         description: Forbidden: You can't delete others' logs
 *       404:
 *         description: No Activity Logs found
 */
activityLogRouter.delete('/deleteAll', deleteAll);

export default activityLogRouter;
