import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import dbConnect from './DBConnect/db';
import 'dotenv/config'

import cookieParser from 'cookie-parser';


dbConnect();
import authRouter from './routes/authRoute';
import { userSchema } from './Zod/ZodSchema';
import { ZodError } from 'zod';
import warehouseRouter from './routes/whereHouse';
import { isLoggedIn } from './middleware/authMiddleware';
import productRouter from './routes/productRoute';
import swaggerDocs from './swager';
import { registerSocketServer } from './socket';

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/wharehouse', warehouseRouter);
app.use('/api/product', productRouter);

app.get('/',isLoggedIn ,(req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});






app.use((err: any, req: Request, res: Response, next: NextFunction) => {
 if (err instanceof ZodError) {
    console.log("eror=>",err);
    res.status(400).json({
      error: "Validation Error",
      details: err.errors.map(e => e.message).join(', '),
    });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

swaggerDocs(app);

const httpServer = http.createServer(app);
registerSocketServer(httpServer);

httpServer.listen(PORT, () => {
    console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
  console.log(`Server running at http://localhost:${PORT}`);
});
