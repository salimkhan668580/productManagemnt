import mongoose,{Schema,Document} from "mongoose";

export interface IActivityLog extends Document {
    userId:mongoose.Types.ObjectId;
    action: string;
    method:string;
    endPoint:string;
    message: string;
    timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: { type: String, required: true },
    method: { type: String, required: true },
    endPoint: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
