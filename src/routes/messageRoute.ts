import { getMessageById } from '../Controller/messageController';
import { message } from './../types/User.type';

const express = require('express');
const messageRouter = express.Router();

messageRouter.get('/', getMessageById);

export default messageRouter;