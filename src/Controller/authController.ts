import{ Request, Response } from 'express';
import User from '../Models/User';
import { loginSchema, userSchema } from '../Zod/ZodSchema';
import asyncWrapper from '../WrapAsync/wrapAsync';
import { comparePassword, generateToken } from '../lib/comparePassword';


export const registerUser = asyncWrapper( async (req: Request, res: Response) => {
 
    const validateSchema = userSchema.safeParse(req.body);
   if (!validateSchema.success) {
  throw validateSchema.error; 
}
    const result = new User(validateSchema.data);
    await result.save();
    res.status(201).json({
      message: 'User registered successfully',
      data: result
    })

})
export const loginUser = asyncWrapper( async (req: Request, res: Response) => {
 
   const validateSchema = loginSchema.safeParse(req.body);
   if (!validateSchema.success) {
  throw validateSchema.error; 
}
    const findUser=await User.findOne({ email: validateSchema.data.email });
    if(!findUser){
      return res.status(404).json({
        message: 'User not found please register',
        data: null
      })
    }
const isMatch = comparePassword(validateSchema.data.password,findUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken({
    id: String(findUser._id),
    roles: String(findUser.roles),
  });
  if (!token) {
    return res.status(500).json({ message: "Error generating token" });
  }
  res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

   res.status(200).json({
     message: 'User logged in successfully',
     token,
   });

})

