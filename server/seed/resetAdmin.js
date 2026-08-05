// Resets admin password back to default
// Run: node seed/resetAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await Admin.findOne();
  if (!admin) {
    console.log("No admin found. Run seedAdmin.js first.");
    process.exit(1);
  }

  admin.email = "admin@medtrack.com";
  admin.password = "MedTrack2024!";
  await admin.save(); // pre-save hook re-hashes the password

  console.log("✓ Admin reset — email: admin@medtrack.com | password: MedTrack2024!");
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });