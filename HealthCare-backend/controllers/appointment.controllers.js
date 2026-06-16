
const Appointment = require("../models/Appointment.models")
const Slot = require("../models/Slot.models")
const Doctor = require("../models/Doctor.models")

const bookAppointment = async(req,res)=>{
    try{
        const  patientId = req.user.id
        if(!patientId){
            return res.status(400).json({
                message:"Patient did not exists"
            })
        }

        const {doctorId, slotId, symptoms, appointmentDate } = req.body

        const slot = await Slot.findById(
            slotId
        )
        if(!slot){
            return res.status(404).json({
                message:"Slot not found"
            })
        }
        if(slot.isBooked){
            return res.status(400).json({
                message:"Slot already booked"
            })
        }

        const newAppointment = await Appointment.create({
            patientId:patientId,
            doctorId:doctorId,
            slotId:slot._id,
            symptoms,
            appointmentDate:appointmentDate,
        })
        await Slot.findByIdAndUpdate(slotId,{isBooked:true})


        return res.status(201).json({
            message:"Created Appointment",
            appointment:newAppointment
        })

    }catch(err){
        return res.status(400).json({
            message:err.message
        })

    }

}


const getMyAppointments = async(req,res)=>{
    try{
        const patientId = req.user.id

        const appointments = await Appointment.find({patientId:patientId})
        .populate("doctorId" , "specialization consultationFee").
        populate("slotId", "date startTime endTime")

        return res.status(200).json({
            message:"Get appointments",
            appointments:appointments
        })
    }catch(err){
        return res.status(400).json({
            message:err.message
        })
    }
}


const cancelAppointment=async(req,res)=>{
    try{
        const {appointmentid }= req.params
        const appointment = await Appointment.findById(appointmentid)
        if(!appointment){
            return res.status(404).json({
                message:"Appointment not found"
            })
        }
        
        if(appointment.status === "cancelled"){
            return res.status(400).json({
                message:"Appointment cancelled"
            })
        }

        await Appointment.findByIdAndUpdate(appointmentid,{
            status:"cancelled"
        })

        await Slot.findByIdAndUpdate(appointment.slotId,{
            isBooked:false
        })
        return res.status(200).json({
            message:"Update appointment"
        })
        

    }catch(err){
        return res.status(400).json({
            message:err.message
        })

    }

}


const completeAppointment = async(req,res)=>{
    try{
        const {appointmentid} = req.params
        const appointment = await Appointment.findById(appointmentid)
        if(!appointment){
            return res.status(404).json({
                message:"Appointment not found"
            })
        }
        if(appointment.status === "completed"){
            return res.status(400).json({
                message:"Appointment completed"
            })
        }
        await Appointment.findByIdAndUpdate(appointmentid,{
            status:"completed"
        })
        return res.status(200).json({
            message:"Appointment Completed"
        })
    }catch(err){
        return res.status(400).json({
            message:err.message
        })
    }

}


const rescheduleAppointment = async(req,res)=>{
    try{
        const {appointmentid} = req.params
        const {newSlotId} = req.body
        const appointment = await Appointment.findById(appointmentid)
        if(!appointment){
            return res.status(404).json({
                message:"Appointment not found"
            })
        }
        if(appointment.status === "completed" || appointment.status === "cancelled"){
            return res.status(400).json({
                message:"Appointment is either completed or cancelled"
            })
        }
        const slot = await Slot.findById(newSlotId)
        if(!slot){
            return res.status(404).json({
                message:"Slot not found"
            })
        }
        if(slot.isBooked){
            return res.status(400).json({
                message:"Slot is booked"
            })
        }
        await Slot.findByIdAndUpdate(appointment.slotId,{isBooked:false})
        await Slot.findByIdAndUpdate(newSlotId,{isBooked:true})
    
        await Appointment.findByIdAndUpdate(appointmentid,{
            slotId:newSlotId
        })
        return res.status(200).json({
            message:"Appointment Updated"
        })
    }catch(err){
        return res.status(400).json({
            message:err.message
        })
    }

}
const getDoctorAppointments = async(req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id })
        if(!doctor){
            return res.status(404).json({ message: "Doctor not found" })
        }
        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate("patientId", "name email")
            .populate("slotId", "date startTime endTime")

        return res.status(200).json({
            message: "Doctor appointments",
            appointments
        })
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }
}
module.exports = {bookAppointment,getMyAppointments,cancelAppointment,completeAppointment,rescheduleAppointment,getDoctorAppointments}