const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    heroImage:  { type: String, default: "" },
    heroImage2: { type: String, default: "" },
    heroImage3: { type: String, default: "" },
    heroTitle: { type: String, default: "Scrubs for the long shift" },
    heroSub: { type: String, default: "Engineered fabric, tailored cut, made for twelve hours on your feet." },
  },
  { timestamps: true }
);

// Only ever one document — use findOneAndUpdate with upsert
module.exports = mongoose.model("SiteSettings", siteSettingsSchema);