const express = require("express");
const { createOrder, getMyOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", createOrder);
router.get("/mine", protect, getMyOrders);
router.delete("/:id", adminAuth, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
module.exports = router;