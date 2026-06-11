const express = require("express")
const router = express.Router()
const {createSlot,getSlotsByDoctor} = require("../controllers/slot.controllers")
const auth = require("../middlewares/auth.middlewares")
const role = require("../middlewares/role.middlewares")

router.post("/slots",auth,role("doctor"),createSlot)
router.get("/:id/slots",getSlotsByDoctor)

module.exports = router

