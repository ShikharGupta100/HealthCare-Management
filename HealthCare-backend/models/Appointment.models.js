
const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    slotId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Slot",
        required:true
    },
    status:{
        type:String,
        enum: ["pending","confirmed","completed","cancelled"],
        default:"pending"
    },
    symptoms:{
        type:String
    },
    appointmentDate:{
        type:Date,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["pending", "paid", "failed"],
        default:"pending"
    },
    paymentId:{
        type:String,
        default:""
    }
},{timestamps:true})

module.exports = mongoose.model("Appointment",appointmentSchema)
