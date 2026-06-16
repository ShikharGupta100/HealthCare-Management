// import express, router
// import all 5 functions from appointment.controller
// import auth and role middleware

// POST /        → auth + role("patient") + bookAppointment
// GET  /my      → auth + getMyAppointments
// PUT  /:appointmentid/cancel     → auth + cancelAppointment
// PUT  /:appointmentid/complete   → auth + role("doctor") + completeAppointment
// PUT  /:appointmentid/reschedule → auth + rescheduleAppointment

// export router
const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth.middlewares")
const role = require("../middlewares/role.middlewares")
const  {bookAppointment,getMyAppointments,cancelAppointment,completeAppointment,rescheduleAppointment,getDoctorAppointments} = require("../controllers/appointment.controllers")

router.post("/",auth,role("patient"),bookAppointment)
router.get("/my",auth,getMyAppointments)
router.put("/:appointmentid/cancel",auth,cancelAppointment)
router.put("/:appointmentid/complete",auth,role("doctor"),completeAppointment)
router.put("/:appointmentid/reschedule",auth,rescheduleAppointment)
router.get("/doctor", auth, role("doctor"), getDoctorAppointments)

module.exports = router
