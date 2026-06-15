const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectToDB = require("./config/db")
const cookieParser=require("cookie-parser")
const errorHandler = require("./middlewares/error.middlewares")

dotenv.config()
require("./jobs/reminderCron")
const PORT = process.env.PORT || 8000

const app = express()
connectToDB()

app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("App is running")
})

app.use("/api/auth",require("./routes/auth.routes"))
app.use("/api/doctors",require("./routes/doctor.routes"))
app.use("/api/doctors",require("./routes/slot.routes"))
app.use("/api/appointments",require("./routes/appointment.routes"))
app.use("/api/prescriptions",require("./routes/prescription.routes"))
app.use("/api/admin",require("./routes/admin.routes"))
app.use("/api/ai",require("./routes/ai.routes"))
app.use("/api/payment",require("./routes/payment.routes"))

app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})