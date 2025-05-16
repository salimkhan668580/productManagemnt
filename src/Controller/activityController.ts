import { constrainedMemory } from "process";
import saveActivityLog from "../lib/saveActivity";
import ActivityLog from "../Models/ActivityLog";
import asyncWrapper from "../WrapAsync/wrapAsync";
import {Request, Response} from "express";

export const getActivityLogs=asyncWrapper(async (req:Request, res:Response) => {
    const {id} = req.query;
    const activityLogs = await ActivityLog.find({userId:id}).sort({createdAt:-1}).populate('userId').select('-__v');
    res.status(200).json(activityLogs);
});

export const deleteById=asyncWrapper(async (req:Request, res:Response) => {
    const {logId} = req.body;
      const userRole = req.user?.roles;
    if (!logId) {
        return res.status(400).json({ message: "Log ID is required" });
    }



    const activityLogsData = await ActivityLog.findById(logId);
    if (!activityLogsData) {
  return res.status(404).json({ message: "Activity Log not found" });
}

 if (activityLogsData?.userId.toString() !== req.user?.id && userRole !== 'admin') {
  return res.status(403).json({ message: "Forbidden: You can't delete others' logs" });
}

    const activityLogs = await ActivityLog.findByIdAndDelete(logId);
    if (!activityLogs) {
        return res.status(404).json({ message: "Activity Log not found" });
    }
      if(userRole!=='admin'){

          const data = {
              userId: activityLogs.userId,
              action: "Delete",
              method: "DELETE",
              endPoint: "/api/activity-log/delete",
              message: `Activity Log with ID ${logId} deleted`,
              timestamp: new Date()
          };
          await saveActivityLog(data);
  }
    res.status(200).json({
        message: "Activity Log deleted successfully",
        activityLogs
    });



});


export const deleteAll = asyncWrapper(async (req: Request, res: Response) => {
  const userIdToDelete = req.user?.id;
  const userRole = req.user?.roles;
  if (!userIdToDelete || (req.body.userId && req.body.userId !== userIdToDelete && userRole !== 'admin')) {
    return res.status(403).json({ message: "Forbidden: You can't delete others' logs" });
  }


  const activityLogsData = await ActivityLog.find({ userId: userIdToDelete });
  if (!activityLogsData || activityLogsData.length === 0) {
    return res.status(404).json({ message: "No Activity Logs found" });
  }


  const activityLogs = await ActivityLog.deleteMany({ userId: userIdToDelete });


  if(userRole!=='admin'){
      const data = {
        userId: userIdToDelete,
        action: "DELETE_ALL_ACTIVITY_LOGS",
        method: "DELETE",
        endPoint: "/api/activity-log/deleteAll",
        message: `All Activity Logs deleted`,
        timestamp: new Date(),
      };
      await saveActivityLog(data);
  }

  res.status(200).json({
    message: "Activity Logs deleted successfully",
    activityLogs,
  });
});


