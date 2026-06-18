
const User = require("../models/User.model")
const Doctor = require("../models/Doctor.models")
const Appointment = require("../models/Appointment.models")

// const getAllUsers = async(req,res)=>{
//     try{
//         const users = await User.find().select("-password")
//         return res.status(200).json({
//             message:"All users",
//             users:users
//         })

//     }catch(err){
//         return res.status(500).json({
//             message:err.message
//         })

//     }
// }
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        const usersWithApproval = await Promise.all(
            users.map(async (user) => {

                if (user.role === "doctor") {

                    const doctor = await Doctor.findOne({ userId: user._id });

                    return {
                        ...user.toObject(),
                        isApproved: doctor ? doctor.isApproved : false
                    };
                }

                return user.toObject();
            })
        );

        return res.status(200).json({
            message: "All users",
            users: usersWithApproval
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};


const approveDoctor = async(req,res)=>{
    try{
        const {doctorId} = req.params
        const doctor = await Doctor.findOne({userId:doctorId})
        if(!doctor){
            return res.status(404).json({
                message:"Doctor Not found"
            })
        }
        doctor.isApproved = true;
        await doctor.save();
        // const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId,
        //     {isApproved:true},
        //     {new:true}).select("-password")
    
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
        user.isActive = !user.isActive;
        await user.save();
        // const updatedUser = await User.findByIdAndUpdate(userId,
        //      { isActive: !user.isActive },
        //     {new:true})
        return res.status(200).json({
            message:"User Updated",
            updatedUser:user
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