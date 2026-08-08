const express = require("express");
const { createOrder, getMyOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", createOrder);
router.get("/mine", protect, getMyOrders);

module.exports = router;