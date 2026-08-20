const express = require("express");
const router = express.Router();
const Discount = require("../models/Discount");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/discounts/validate  — public, used by checkout
router.post(
  "/validate",
  asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "No code provided" });

    const discount = await Discount.findOne({
      code: code.toUpperCase().trim(),
      active: true,
    });

    if (!discount) {
      return res.status(404).json({ message: "Invalid or inactive discount code" });
    }

    res.json({ code: discount.code, percentage: discount.percentage });
  })
);

module.exports = router;