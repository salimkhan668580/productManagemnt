import {createOrder}  from "../Controller/orderController";

const express= require('express');
const orderRouter = express.Router();



orderRouter.post('/', createOrder);

export default orderRouter