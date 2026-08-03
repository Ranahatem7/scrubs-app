const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: { type: String, default: "" },  // e.g. "TEN POCKETS"
  image: { type: String, default: "" },      // URL
  slug: { type: String, required: true, unique: true }, // e.g. "tops", "pants"
  order: { type: Number, default: 0 },       // display order
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);