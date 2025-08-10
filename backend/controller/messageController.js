import {Message} from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";



export const sendMessage = async (req, res, next) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill full form", 400))
  }
  await Message.create({ name, email, phone, message });
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
};

export const getAllMessages = catchAsyncErrors(async(req,res,next) => {
  const message = await Message.find();
  res.status(200).json({
    success: true,
    message,
  })
})