const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, index: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  decision: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  remarks: { type: String, trim: true, maxlength: 500 }
}, { timestamps: true });

approvalSchema.index({ accountId: 1, createdAt: -1 });

module.exports = mongoose.model("Approval", approvalSchema);
