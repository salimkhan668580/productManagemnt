import  jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export interface tokenPayload {
    id: string;
    roles: string;
}

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    return  await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (err: any) {
    throw new Error('Error comparing passwords');
  }
};  


export const generateToken=(data:tokenPayload)=>{
    const token = jwt.sign(data, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    });
    return token;
}