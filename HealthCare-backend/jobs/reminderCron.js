// require node-cron
// require Appointment model
// require sendEmail utility

// schedule a cron job — runs every day at 8am
// cron.schedule("0 8 * * *", async () => {
//   get tomorrow's date
//   find all appointments where appointmentDate matches tomorrow
//   populate patientId with name and email
//   loop through appointments and send email to each patient
// })
const cron = require("node-cron")
const Appointment = require("../models/Appointment.models")
const sendEmail = require("../utils/sendEmail")


cron.schedule("0 8 * * *", async() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const appointments = await Appointment.find({
        appointmentDate:tomorrow
    }).populate("patientId", "name email")
    
    for(const appointment of appointments){
        await sendEmail(
            appointment.patientId.email,
            "Appointment Reminder",
            `Dear ${appointment.patientId.name}, you have an appointment tomorrow.`
        )
    }
})



