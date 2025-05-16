// socket.ts
import { Server } from "socket.io";
import http from "http";
import Conversation from './Models/Converation';
import Message from './Models/Message';
import  jwt from "jsonwebtoken";
export const registerSocketServer = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Middleware for token authentication
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;

//   if (!token) {
//     return next(new Error("Authentication error: Token required"));
//   }

//   try {
//     const decoded = jwt.verify(token, "your_jwt_secret_key");
//     next();
//   } catch (err) {
//     next(new Error("Authentication error: Invalid token"));
//   }
// });


  io.on("connection", (socket) => {
    console.log("Socket ID:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("room-join", async ({ roomId }) => {
      const [senderId, receiverId] = roomId.split("-");
      const sortedIds = [senderId, receiverId].sort();
      const room_Id = `${sortedIds[0]}-${sortedIds[1]}`;
      socket.join(room_Id);

      let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId], $size: 2 }
      });

      if (!conversation) {
        conversation = new Conversation({
          members: [senderId, receiverId],
        });
        await conversation.save();
      }

      console.log(`User ${socket.id} joined room: ${room_Id}`);
    });

    socket.on("message", async ({ message, room }) => {
      const [senderId, receiverId] = room.split("-");
      const sortedIds = [senderId, receiverId].sort();
      const normalizedRoomId = `${sortedIds[0]}-${sortedIds[1]}`;
      socket.to(normalizedRoomId).emit("rcv_message", message);
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();
       let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId], $size: 2 }
      });

      if (conversation) {
        conversation.messages.push(newMessage._id);
        conversation.lastMessage = newMessage._id;
        await conversation.save();
      }else{
        conversation = new Conversation({
          members: [senderId, receiverId],
          messages: [newMessage._id],
          lastMessage: newMessage._id,
        });
        await conversation.save();
      }
    });
  });
};
