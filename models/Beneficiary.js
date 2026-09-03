const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, index: true },
  beneficiaryAccountNumber: { type: String, required: true, trim: true },
  nickname: { type: String, required: true, trim: true, maxlength: 50 },
  status: { type: String, enum: ["active", "blocked"], default: "active" }
}, { timestamps: true });

beneficiarySchema.index({ accountId: 1, beneficiaryAccountNumber: 1 }, { unique: true });

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
