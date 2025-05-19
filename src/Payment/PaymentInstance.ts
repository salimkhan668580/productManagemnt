import Razorpay from 'razorpay'

export const Paymentinstance = new Razorpay({ key_id: process.env.RAZORPAY_ID_KEY, key_secret: process.env.RAZORPAY_SECRET_KEY })
