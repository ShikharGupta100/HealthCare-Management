
const User = require("../models/User.model")
const Doctor = require("../models/Doctor.models")
const Appointment = require("../models/Appointment.models")

const getAllUsers = async(req,res)=>{
    try{
        const users = await User.find().select("-password")
        return res.status(200).json({
            message:"All users",
            users:users
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })

    }
}


const approveDoctor = async(req,res)=>{
    try{
        const {doctorId} = req.params
        const doctor = await Doctor.findById(doctorId)
        if(!doctor){
            return res.status(404).json({
                message:"Doctor Not found"
            })
        }
        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId,{isApproved:true},{new:true}).select("-password")
    
        return res.status(200).json({
            message:"Doctor updated",
            updatedDoctor:updatedDoctor
        })
    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}


const deactivateUser = async(req,res)=>{
    try{
        const {userId} = req.params
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                message:"User Not Found"
            })
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{isActive:false},{new:true})
        return res.status(200).json({
            message:"User Updated",
            updatedUser:updatedUser
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })

    }
}



const getStats = async(req,res)=>{

    try{
        const totalUsers = await User.countDocuments()
        const totalDoctors = await Doctor.countDocuments()
        const totalAppointments = await Appointment.countDocuments()

        return res.status(200).json({
            message:"Total members",
            totalUsers:totalUsers,
            totalDoctors:totalDoctors,
            totalAppointments:totalAppointments
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }

}

module.exports = {getAllUsers,approveDoctor,deactivateUser,getStats}