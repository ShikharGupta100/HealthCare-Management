const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectToDB = require("./config/db")

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()
connectToDB()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("App is running")
})

app.use("/api/auth",require("./routes/auth.routes"))


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})