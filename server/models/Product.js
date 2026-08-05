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
    // Free-form string — no enum, categories are managed in the DB
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },
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

// Auto-generate slug from name before saving
productSchema.pre("save", async function (next) {
  if (!this.isModified("name") && this.slug) return next();

  let base = this.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Make slug unique by appending a number if needed
  let slug = base;
  let count = 1;
  while (await mongoose.model("Product").exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;
  next();
});

module.exports = mongoose.model("Product", productSchema);