
const cron = require("node-cron")
const Appointment = require("../models/Appointment.models")
const sendEmail = require("../utils/sendEmail")


cron.schedule("0 8 * * *", async() => {
    const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

const tomorrowEnd = new Date(tomorrow)
tomorrowEnd.setHours(23, 59, 59, 999)

const appointments = await Appointment.find({
    appointmentDate: { $gte: tomorrow, $lte: tomorrowEnd }
}).populate("patientId", "name email")
    
    for(const appointment of appointments){
        await sendEmail(
            appointment.patientId.email,
            "Appointment Reminder",
            `Dear ${appointment.patientId.name}, you have an appointment tomorrow.`
        )
    }
})



