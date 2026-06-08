const express=require("express")
const router=express.Router()
const {registerDoctorProfile,getAllDoctors,getDoctorById}=require("../controllers/doctor.controllers")
const role = require("../middlewares/auth.middlewares")
const auth = require("../middlewares/role.middlewares")


router.post("/profile", role, auth("doctor"), registerDoctorProfile)
router.get("/",getAllDoctors)
router.get("/:id",getDoctorById)


module.exports =router