
const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth.middlewares")
const role = require("../middlewares/role.middlewares")
const { createPrescription, getMyPrescriptions, downloadPrescriptionPDF } = require("../controllers/prescription.controllers")

router.post("/",auth,role("doctor"),createPrescription)
router.get("/my",auth,getMyPrescriptions)
router.get("/:prescriptionId/pdf",auth,downloadPrescriptionPDF)

module.exports = router