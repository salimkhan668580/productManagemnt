
import { CronJob } from 'cron';
import ActivityLog from "../Models/ActivityLog"


const job = new CronJob('* * * 6 *', async () => {
const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - 6);
  await ActivityLog.deleteMany({ createdAt: { $lt: cutoff } });
  console.log('Old activity logs deleted');
});

job.start();