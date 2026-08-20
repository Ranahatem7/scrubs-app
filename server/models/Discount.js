const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percentage: { type: Number, required: true, min: 1, max: 100 },
    active: { type: Boolean, default: true },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);