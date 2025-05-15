import { Last } from './../../node_modules/socket.io/dist/typed-events.d';
import mongoose from "mongoose";
import Conversation from "../Models/Converation";
import Message from "../Models/Message";
import asyncWrapper from "../WrapAsync/wrapAsync";


export const getMessageById=asyncWrapper(async (req, res) => {

    const { id } = req.query;
    const [senderId, receiverId] = id?.toString().split("-") || [];
    const sortedIds = [senderId, receiverId].sort();
    const normalizedRoomId = `${sortedIds[0]}-${sortedIds[1]}`;
    if (!id) {
         return res.status(400).json({ message: 'admin and user  ID is required' });
    }
    
   const messageAggregate = await Conversation.aggregate([
        {
    $match: {
      $expr: {
        $and: [
          { $eq: [ { $size: "$members" }, 2 ] },
          { $setEquals: ["$members", [new mongoose.Types.ObjectId(senderId), new mongoose.Types.ObjectId(receiverId)]] }
        ]
      }
    }
  },
  {
    $lookup:{
        from:"users",
        localField:"members",
        foreignField:"_id",
        as:"membersInfo",
       pipeline: [
         {
           $project: {
             _id: 1,
             name: 1,
             email: 1,
             roles: 1,
           }
         }
       ]
    }

  },
  {
    $lookup: {
        from: "messages",
        localField: "messages",
        foreignField: "_id",
        as: "messagesInfo",
    }

  },

  {
    $lookup: {
      from: "messages",
      localField: "lastMessage",
      foreignField: "_id",
      as: "lastMessage",
    }
  },
  {
    $unwind: {
      path: "$lastMessage",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 1,
      lastMessage:"$lastMessage.message",
      "messagesInfo": 1

    }
}

        

   ])



   res.status(200).json({
    success: true,
    message: "Message fetched successfully",
    data: messageAggregate
   });
});