const express=require("express")
const router=express.Router()
const {registerDoctorProfile,getAllDoctors,getDoctorById,rateDoctor}=require("../controllers/doctor.controllers")
const auth = require("../middlewares/auth.middlewares")
const role = require("../middlewares/role.middlewares")
const upload = require("../middlewares/upload.middlewares")


router.get("/",getAllDoctors)
router.get("/:id",getDoctorById)
router.post("/profile",auth,role("doctor"),upload.single("profilePhoto"),registerDoctorProfile)
router.post("/:doctorId/rate",auth,role("patient"),rateDoctor)


module.exports = router