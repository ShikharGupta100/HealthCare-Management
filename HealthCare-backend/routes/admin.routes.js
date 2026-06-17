
const express = require("express")
const router = express.Router()
const {getAllUsers,approveDoctor,deactivateUser,getStats} = require("../controllers/admin.controllers")
const auth = require("../middlewares/auth.middlewares")
const role = require("../middlewares/role.middlewares")

router.get("/users",auth,role("admin"),getAllUsers)
router.put("/doctors/:doctorId/approve",auth,role("admin"),approveDoctor)
router.patch("/users/:userId",auth,role("admin"),deactivateUser)
router.get("/stats", auth,role("admin"),getStats)

module.exports = router