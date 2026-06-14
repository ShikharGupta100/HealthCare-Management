
const {checkSymptoms,generateClinicalNotes,generatePatientSummary, generateHealthPlan} = require("../services/aiService")
const symptomChecker = async(req,res)=>{
    try{
        const {symptoms} = req.body
        if(!symptoms){
            return res.status(400).json({
                message:"No symptoms exist"
            })
        }
        const result =await checkSymptoms(symptoms)
        return res.status(200).json({
            message:"Symptoms checked",
            result:result
        })
    }catch(err){
        return res.status(500).json({
            message:err.message
        })

    }
}

const clinicalNotesGenerator = async(req,res)=>{
    try{
        const {conversationText} = req.body
        if(!conversationText){
            return res.status(400).json({
                message:"No conversationText exist"
            })
        }
        const result = await generateClinicalNotes(conversationText)
        return res.status(200).json({
            message:"conversationText checked",
            result:result
        })
        

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}
const patientSummaryGenerator = async(req, res) => {
    try {
        const { prescription, diagnosis } = req.body
        if(!prescription || !diagnosis){
            return res.status(400).json({ message: "Prescription and diagnosis are required" })
        }
        const result = await generatePatientSummary(prescription, diagnosis)
        return res.status(200).json({ message: "Patient summary generated", result })
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }
}

const healthPlanGenerator = async(req, res) => {
    try {
        const { patientProfile, diagnosis } = req.body
        if(!patientProfile || !diagnosis){
            return res.status(400).json({ message: "Patient profile and diagnosis are required" })
        }
        const result = await generateHealthPlan(patientProfile, diagnosis)
        return res.status(200).json({ message: "Health plan generated", result })
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }
}
module.exports = {symptomChecker,clinicalNotesGenerator,patientSummaryGenerator, healthPlanGenerator}