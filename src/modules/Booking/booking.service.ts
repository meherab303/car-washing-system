/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import { TBooking } from "./booking.interface";
import { BookingSlotModel } from "../BookingSlot/bookingSlot.model";
import { BookingModel } from "./booking.model";
import { UserModel } from "../User/user.model";

const createBookingIntoDB=async(payload:TBooking)=>{
    const {slot,customer,service}=payload
    
    const isCustomerExist=await UserModel.findById(customer)
    if(!isCustomerExist){
        throw new Error("user doesn't exist")
    }
    const isSlotExist=await BookingSlotModel.findById(slot)
    
    if(!isSlotExist){
        throw new Error("slot doesn't exist")
    }
    const isServiceBelongToSlot=await BookingSlotModel.findOne({_id:slot,service})

    if(!isServiceBelongToSlot){
        throw new Error("this service is not belong to this slot ")
    }

    if(isSlotExist?.isBooked!=='available'){
        throw new Error("slot is not available")
    }
    
    const session = await mongoose.startSession();
  try{
    session.startTransaction();
    const result=await BookingModel.create([payload],{session})
    if(!result.length){
        throw new Error("failed to book your slot")
    }
    await BookingSlotModel.findByIdAndUpdate(slot,{isBooked:"booked"},{session})
    await session.commitTransaction()
    await session.endSession()
    return result
  }catch(error:any){
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error);

  }
}
const getAllBookingsFromDB=async()=>{
    const result=await BookingModel.find().populate("customer service slot")
    return result
} 
const updateBookingIntoDB=async(id:string,payload:Partial<TBooking>)=>{
    const booking = await BookingModel.findById(id);
    if (!booking) {
      throw new Error("Booking  is not found");
    }
    const result = await BookingModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return result;
}

const cancelledBookingFromDB=async(id:string)=>{
    const isBookingExist=await BookingModel.findById(id)
    if(!isBookingExist){
        throw new Error("Booking is not found")
    }
    
    const session = await mongoose.startSession();
    try{
      session.startTransaction();
      await BookingSlotModel.findByIdAndUpdate(isBookingExist?.slot,{isBooked:"available"},{session})
      const result=await BookingModel.findByIdAndDelete(id)
      await session.commitTransaction()
      await session.endSession()
      return result
    }catch(error:any){
      await session.abortTransaction()
      await session.endSession()
      throw new Error(error);
  
    }

}
export const BookingService={
    createBookingIntoDB,
    getAllBookingsFromDB,
    updateBookingIntoDB,
    cancelledBookingFromDB
}