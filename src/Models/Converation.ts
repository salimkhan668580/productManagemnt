import { conversation, message } from './../types/User.type';
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema<conversation>(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Message",
        default: [],
    }
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;