import mongoose from "mongoose";

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type message={
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type conversation = {
    members: mongoose.Types.ObjectId[];
    lastMessage: mongoose.Types.ObjectId;

    createdAt?: Date;
    updatedAt?: Date;
}