import express from 'express';
import { getActivityLogs, deleteById, deleteAll } from '../Controller/activityController';
import { isLoggedIn } from '../middleware/authMiddleware';

const activityLogRouter = express.Router();
activityLogRouter.use(isLoggedIn);

activityLogRouter.get('/', getActivityLogs);


activityLogRouter.delete('/delete', deleteById);


activityLogRouter.delete('/deleteAll', deleteAll);

export default activityLogRouter;
