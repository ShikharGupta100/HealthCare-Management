const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    specialization:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experience:{
        type:Number
    },
    consultationFee:{
        type:Number
    },
    availableDays:{
        type:[String]
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default:0
    }
},{timestamps:true}
)

module.exports = mongoose.model("Doctor",doctorSchema)