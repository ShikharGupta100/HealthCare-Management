const Doctor = require("../models/Doctor.models")
const User= require("../models/User.model")

const registerDoctorProfile = async(req,res)=>{
    try{
        const userId = req.user.id
        const {specialization, qualification, experience, consultationFee, availableDays } = req.body
    
        const doctorProfile = await Doctor.findOne({userId})
        if(doctorProfile){
            return res.status(400).json({
                message:"Doctor Profile Exists"
            })
        }
    
        const newDoctor = await Doctor.create({
            userId,
            specialization,
             qualification,
              experience,
               consultationFee,
                availableDays
    
        })
    
        return res.status(201).json({
            message:"Doctor Profile Created",
            doctor:newDoctor
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}


const getAllDoctors = async(req,res)=>{
    try{
        const filter = {
            isApproved:true
        }
        if(req.query.specialization){
            filter.specialization = req.query.specialization
        }
        const allDoctors= await Doctor.find(
            filter
        ).populate(
            "userId",
            "name email"
        )

        return res.status(200).json({
            success:true,
            doctors:allDoctors
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

const getDoctorById = async(req,res)=>{
    try{
        const {id} = req.params
        const doctor = await Doctor.findById(id).populate("userId","name email")
        if(doctor){
            return res.status(200).json({
                message:"Doctor Found",
                doctor:doctor
            })
        }else{
            return res.status(404).json({
                message:"Doctor not found"
            })
        }
    }catch(err){
        return res.status(500).json({
            message:err.message
        })

    }
}


module.exports = {registerDoctorProfile,getAllDoctors,getDoctorById}