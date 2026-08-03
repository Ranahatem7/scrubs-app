// Run once to create the first admin account:
// node seed/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne();
  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }

  await Admin.create({
    email: "admin@medtrack.com",
    password: "MedTrack2024!",
  });

  console.log("✓ Admin created — email: admin@medtrack.com | password: MedTrack2024!");
  console.log("  Change these from the admin panel after first login.");
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });