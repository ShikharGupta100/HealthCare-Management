
const stripe = require("../config/stripe")
const Doctor = require("../models/Doctor.models")
const Appointment = require("../models/Appointment.models")
const createPaymentIntent = async(req,res)=>{
    try{
        const {doctorId} = req.body
        const doctor = await Doctor.findById(doctorId)
        if(!doctor){
            return res.status(404).json({
                message:"Doctor Not found"
            })
        }
        const paymentIntent = await stripe.paymentIntents.create({
        amount: doctor.consultationFee * 100,
        currency: "inr"
        })
        return res.status(200).json({
       clientSecret: paymentIntent.client_secret
        })
        
    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }

}

const confirmPayment = async(req,res)=>{
    try{
        const {appointmentId, paymentIntentId} = req.body
        const appointment = await Appointment.findById(appointmentId)
        if(!appointment){
            return res.status(404).json({
                message:"Appointment Not Found"
            })
        }
        const updatedAppointment =  await Appointment.findByIdAndUpdate(
            appointmentId,
            {paymentStatus:"paid",
            paymentId:paymentIntentId},
        {new:true})
            return res.status(200).json({
                message:"Confirm Appointment",
                updatedAppointment:updatedAppointment
            })
    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}
module.exports = {createPaymentIntent,confirmPayment}