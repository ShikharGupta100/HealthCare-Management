
const groq = require("../config/groq")


const checkSymptoms = async(symptoms) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a medical AI assistant. Respond only in JSON format, no extra text."
            },
            {
                role: "user",
                content: `Patient symptoms: ${symptoms}. Suggest possible condition and recommended specialist. Format: { "condition": "", "specialist": "", "severity": "", "advice": "" }`
            }
        ]
    })

    const text = response.choices[0].message.content
    const clean = text.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
}


const generateClinicalNotes = async(conversationText)=>{
    const response  = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages:[
           {role:"system",
            content:"You are a medical AI. Respond only in JSON."},
           {role: "user",
            content:`Analyze this conversation and generate SOAP notes: ${conversationText}. 
            Format: { "subjective": "", "objective": "", "assessment": "", "plan": "" }`},
            
        ]

    })
     const text = response.choices[0].message.content
    const clean = text.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
}

const generatePatientSummary = async(prescription, diagnosis) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a medical AI assistant. Respond only in JSON format, no extra text."
            },
            {
                role: "user",
                content: `Explain this prescription and diagnosis in simple plain language for a patient.
                Diagnosis: ${diagnosis}
                Prescription: ${JSON.stringify(prescription)}
                Format: { "summary": "", "medicineExplanations": [], "lifestyleTips": [], "followupCriteria": "" }`
            }
        ]
    })

     const text = response.choices[0].message.content
    const clean = text.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
}

const generateHealthPlan = async(patientProfile, diagnosis) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a medical AI assistant. Respond only in JSON format, no extra text, no markdown."
            },
            {
                role: "user",
                content: `Generate a personalized day-by-day recovery plan for this patient.
                Patient Profile: ${JSON.stringify(patientProfile)}
                Diagnosis: ${diagnosis}
                
                You MUST return exactly this JSON structure:
                {
                    "recoveryPlan": [
                        { "day": 1, "description": "activity description here" },
                        { "day": 2, "description": "activity description here" }
                    ],
                    "dietRecommendations": [
                        { "foodType": "food name", "description": "description here" }
                    ],
                    "exerciseSuggestions": [
                        { "exerciseType": "exercise name", "description": "description here" }
                    ],
                    "medicationReminders": [
                        { "medication": "medicine name", "dosage": "dosage here", "description": "description here" }
                    ]
                }`
            }
        ]
    })

    const text = response.choices[0].message.content
    const clean = text.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
}
module.exports = { checkSymptoms, generateClinicalNotes, generatePatientSummary ,generateHealthPlan}