const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, index: true },
  type: {
    type: String,
    enum: ["deposit", "withdrawal", "transfer_in", "transfer_out", "interest"],
    required: true
  },
  amount: { type: Number, required: true, min: 0.01 },
  balanceAfter: { type: Number, required: true, min: 0 },
  relatedAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account", default: null },
  flagged: { type: Boolean, default: false },
  flagReason: { type: String, default: null },
  transferReference: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, immutable: true }
});

transactionSchema.index({ accountId: 1, createdAt: -1 });
transactionSchema.index({ flagged: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
