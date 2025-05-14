import jwt from 'jsonwebtoken';
import {Response , Request, NextFunction} from 'express';

interface JwtPayload {
id: string;
roles: string;
  }
declare global {
    namespace Express {
      interface Request {
        user?: JwtPayload;
      }
    } 
  }
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.header('token');

  // console.log('Incoming request with headers: ', req.headers);

  if (!token) {
     res.status(401).send({ error: 'Authentication failed. No token provided.' });
  }


  // console.log('Token extracted from header: ', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // console.log('Token decoded successfully: ', decoded);
    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    console.log('Error while verifying token: ', error);

    res.status(401).send({ error: 'Authentication failed. Invalid token.' });
  }
};
