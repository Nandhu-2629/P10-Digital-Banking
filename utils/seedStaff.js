const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedStaff() {
  const email = process.env.STAFF_EMAIL || "staff@example.com";
  const password = process.env.STAFF_PASSWORD || "Password123!";
  const exists = await User.findOne({ email });
  if (exists) return exists;
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({
    name: "Demo Bank Staff",
    email,
    passwordHash,
    role: "bank_staff",
    kycStatus: "approved"
  });
}

module.exports = seedStaff;
