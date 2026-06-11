const Slot = require("../models/Slot.models")
const Doctor=require("../models/Doctor.models")

const createSlot = async(req,res)=>{
    try{
        const doctor = await Doctor.findOne({
            userId:req.user.id
        })
        if(!doctor){
            return res.status(400).json({
                message:"Doctor did not exists for this slot"
            })
        }
        const {date,startTime,endTime} = req.body

        const newSlot = await Slot.create({
            doctorId:doctor._id,
            date,
            startTime,
            endTime
        })

        return res.status(201).json({
            message:"Slot Created Successfully",
            slot:newSlot
        })

    }catch(err){
        res.status(401).json({
            message:err.message
        })
    }


}

const getSlotsByDoctor = async(req,res)=>{
    try{
        const {id} = req.params
        const filter = {
            doctorId:id,
            isBooked:false
        }
        if(req.query.date){
            filter.date = req.query.date
        }
        const slots = await Slot.find(
            filter
        )
        return res.status(200).json({
            message:"slot alloted",
            slots:slots
        })

    }catch(err){
        res.status(401).json({
            message:err.message
        })
    }
}
module.exports = {createSlot,getSlotsByDoctor}