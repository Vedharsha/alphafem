const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const investmentController = require("../controllers/investmentController");
router.get("/", (req, res) => {
    res.json({ message: "inves API is working!" });
});
// Calculate SIP
router.post("/sip", authMiddleware, investmentController.calculateSIP);

module.exports = router;