const express=require("express")
const router=express.Router()
const {registerDoctorProfile,getAllDoctors,getDoctorById}=require("../controllers/doctor.controllers")
const auth = require("../middlewares/auth.middlewares")
const role = require("../middlewares/role.middlewares")


router.post("/profile",auth, role("doctor"), registerDoctorProfile)
router.get("/",getAllDoctors)
router.get("/:id",getDoctorById)


module.exports =router