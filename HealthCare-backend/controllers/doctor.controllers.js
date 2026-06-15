const Doctor = require("../models/Doctor.models")
const User= require("../models/User.model")


const registerDoctorProfile = async(req,res)=>{
    try{
        const userId = req.user.id
        const {specialization, qualification, experience, consultationFee, availableDays } = req.body
        let profilePhoto = ""
        if(req.file){
            profilePhoto = req.file.path
        }
    
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
                availableDays,
                profilePhoto:profilePhoto
    
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
        if(req.query.city){
        filter.city = req.query.city
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

const rateDoctor = async(req,res)=>{
    try{
        const {doctorId} = req.params
        const {rating} = req.body
        const doctor = await Doctor.findById(doctorId)
            if(!doctor){
                return res.status(404).json({
                    message:"Doctor Not Found"
                })
            }
            if(rating < 1 || rating > 5){
                return res.status(400).json({
                    message:"Rating must be between 1 and 5"
                })
            }
            const newRating = (doctor.rating * doctor.totalRatings + rating) / (doctor.totalRatings + 1)
            const updateDoctor = await Doctor.findByIdAndUpdate(
                doctorId,
                {rating:newRating,
                    totalRatings:doctor.totalRatings+1
                }
            ,{new:true})
            return res.status(200).json({
                message:"Updated Doctor",
                updateDoctor:updateDoctor
            })
            }catch(err){
                return res.status(500).json({
                    message:err.message
                })
            }

    }

module.exports = {registerDoctorProfile,getAllDoctors,getDoctorById,rateDoctor}