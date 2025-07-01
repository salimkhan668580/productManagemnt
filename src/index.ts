import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import dbConnect from './DBConnect/db';
import 'dotenv/config'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import winston from 'winston';


dbConnect();
import authRouter from './routes/authRoute';
import { userSchema } from './Zod/ZodSchema';
import { ZodError } from 'zod';
import warehouseRouter from './routes/whereHouse';
import { isLoggedIn } from './middleware/authMiddleware';
import productRouter from './routes/productRoute';
import swaggerDocs from './swager';
import { registerSocketServer } from './socket';
import messageRouter from './routes/messageRoute';
import activityLogRouter from './routes/activityLogRouter';
import "./Corn/corn.ts"
import orderRouter from './routes/orderRoutes';
import wishListRouter from './routes/wishListRouter';

const app = express();
const PORT = 3000;
// setup the logger 
app.use(morgan('dev'))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/wharehouse', warehouseRouter);
app.use('/api/product', productRouter);
app.use('/api/message',messageRouter);
app.use('/api/activity-log', activityLogRouter);
app.use('/api/createPayment', orderRouter);
app.use('/api/wishlist', wishListRouter);
const logger = winston.createLogger({
  level: 'info', // sabse kam priority level (info, warn, error)
  format: winston.format.combine(
     winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(), // Console me dikhaye
    new winston.transports.File({ filename: 'logs/app.log' }) // File me save kare
  ]
});


app.get('/',isLoggedIn ,(req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
 if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors.map(e => e.message).join(', '),
    });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || err.description||"Something went wrong",
  });
});

swaggerDocs(app);

const httpServer = http.createServer(app);
registerSocketServer(httpServer);

httpServer.listen(PORT, () => {
    console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
    logger.info(`Server running at http://localhost:${PORT}`);

  // console.log(`Server running at http://localhost:${PORT}`);
});
