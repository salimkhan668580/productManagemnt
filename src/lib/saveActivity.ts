import { message } from './../types/User.type';
import ActivityLog from "../Models/ActivityLog";
import mongoose from 'mongoose';


const saveActivityLog = async ({
  userId,
  action,
  method,
  endPoint,
  message,
}: {
  userId?: string | mongoose.Types.ObjectId;
  action: string;
  method: string;
  endPoint: string;
  message: string;
}) => {
  const activityLog = new ActivityLog({
    userId,
    action,
    method,
    endPoint,
    message,
  });

  await activityLog.save();
};

export default saveActivityLog;
