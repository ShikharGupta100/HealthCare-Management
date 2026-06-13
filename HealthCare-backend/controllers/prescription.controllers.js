

const Doctor = require("../models/Doctor.models")
const Appointment = require("../models/Appointment.models")
const User = require("../models/User.model")
const Prescription = require("../models/Prescription.models")

const createPrescription = async(req,res)=>{
    try{
        const doctor = await Doctor.findOne({userId:req.user.id})

        const {appointmentId, patientId, medicines, notes} = req.body

        const appointment = await Appointment.findById(appointmentId)
        if(!appointment){
            return res.status(404).json({
                message:"Appointment Not Exists"
            })
        }
        
        const prescription = await Prescription.findOne({appointmentId})
        if(prescription){
            return res.status(400).json({
                message:"Prescription  Exists"
            })
        }
        const newPrescription = await  Prescription.create({
            appointmentId, patientId, medicines, notes,
            doctorId:doctor._id
        })
    
        return res.status(201).json({
            message:"Prescription created.",
            prescription:newPrescription
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }

}

const getMyPrescriptions = async(req,res)=>{
    try{
        const patientId = req.user.id
        const prescriptions = await Prescription.find({patientId:patientId}).
        populate("doctorId","specialisation timing").populate("appointmentId","appointmentDate symptoms")

        return res.status(200).json({
            message:"Get my prescriptions",
            prescription:prescriptions
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }

}


const downloadPrescriptionPDF = async(req,res)=>{
    try{
        const {prescriptionId} = req.params
        const prescription = await Prescription.findById(prescriptionId)
        .populate("doctorId", "specialization")
        .populate("patientId", "name email")
        .populate("appointmentId", "appointmentDate symptoms")
        if(!prescription){
            return res.status(404).json({
                message:"Prescription not found"
            })
        }
        const PDFDocument = require("pdfkit")
        const doc = new PDFDocument()

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename=prescription-${prescriptionId}.pdf`)

        doc.pipe(res)

        doc.fontSize(20).text("Prescription", { align: "center" })
        doc.moveDown()
        doc.fontSize(12).text(`Doctor Specialization: ${prescription.doctorId.specialization}`)
        doc.text(`Patient: ${prescription.patientId.name}`)
        doc.text(`Date: ${prescription.issuedAt.toDateString()}`)
        doc.moveDown()
        doc.fontSize(14).text("Medicines:", { underline: true })
        prescription.medicines.forEach((med) => {
            doc.fontSize(12).text(`- ${med.name} | Dosage: ${med.dosage} | Duration: ${med.duration}`)
        })
        doc.moveDown()
        doc.fontSize(12).text(`Notes: ${prescription.notes || "N/A"}`)

        doc.end()


    }catch(err){
        return res.status(500).json({
            message:err.message
        })

    }
}
module.exports = {createPrescription,getMyPrescriptions,downloadPrescriptionPDF}