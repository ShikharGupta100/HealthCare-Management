
const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth.middlewares")
const {createPaymentIntent, confirmPayment} = require("../controllers/payment.controllers")

router.post("/create-intent",auth,createPaymentIntent)
router.post("/confirm", auth,confirmPayment)

module.exports = router