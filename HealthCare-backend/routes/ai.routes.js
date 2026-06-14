
const express = require("express")
const router = express.Router()
const {symptomChecker,clinicalNotesGenerator,patientSummaryGenerator, healthPlanGenerator} = require("../controllers/ai.controllers")
const auth = require("../middlewares/auth.middlewares")
const role = require("../middlewares/role.middlewares")

router.post("/symptom-check",auth,symptomChecker)
router.post("/clinical-notes",auth,role("doctor"),clinicalNotesGenerator)
router.post("/patient-summary",auth,patientSummaryGenerator)
router.post("/health-plan",auth,healthPlanGenerator)

module.exports = router
