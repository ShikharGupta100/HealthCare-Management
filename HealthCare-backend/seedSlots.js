const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const Doctor = require("./models/Doctor.models")
const Slot = require("./models/Slot.models")

const seedSlots = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")

        const doctors = await Doctor.find({ isApproved: true })
        console.log(`Found ${doctors.length} doctors`)

        const timeSlots = [
            { startTime: "9:00 AM", endTime: "9:30 AM" },
            { startTime: "9:30 AM", endTime: "10:00 AM" },
            { startTime: "10:00 AM", endTime: "10:30 AM" },
            { startTime: "10:30 AM", endTime: "11:00 AM" },
            { startTime: "11:00 AM", endTime: "11:30 AM" },
            { startTime: "11:30 AM", endTime: "12:00 PM" },
            { startTime: "2:00 PM", endTime: "2:30 PM" },
            { startTime: "2:30 PM", endTime: "3:00 PM" },
            { startTime: "3:00 PM", endTime: "3:30 PM" },
            { startTime: "3:30 PM", endTime: "4:00 PM" },
        ]

        // Generate dates for next 7 days
        const dates = []
        for(let i = 1; i <= 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i)
            dates.push(date)
        }

        for(const doctor of doctors) {
            for(const date of dates) {
                for(const slot of timeSlots) {
                    await Slot.create({
                        doctorId: doctor._id,
                        date: date,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isBooked: false
                    })
                }
            }
            console.log(`✅ Slots created for: ${doctor._id}`)
        }

        console.log("🎉 All slots seeded successfully!")
        process.exit(0)

    } catch(err) {
        console.error("Error:", err.message)
        process.exit(1)
    }
}

seedSlots()