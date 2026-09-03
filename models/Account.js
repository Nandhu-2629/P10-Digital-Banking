const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  accountNumber: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ["savings", "current"], required: true },
  balance: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["pending", "active", "frozen", "rejected"], default: "pending" },
  dailyTransferLimit: { type: Number, default: Number(process.env.DAILY_TRANSFER_LIMIT || 100000) },
  lastInterestDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);
