const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["tops", "pants", "full-scrub", "lab-coats"],
    },
    // "men" / "women" / "unisex" — matches the gender filter used on
    // frontend/src/pages/men.jsx and women.jsx
    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },
    // Short descriptor shown under the product name, e.g. "Men · Slim"
    fit: {
      type: String,
      trim: true,
      default: "",
    },
    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL"],
    },
    colors: {
      type: [colorSchema],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    // Fallback swatch color, used by ProductCard when no image is set
    tone: {
      type: String,
      trim: true,
      default: "#3a3f45",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
