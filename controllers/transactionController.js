const mongoose = require("mongoose");
const crypto = require("crypto");
const Account = require("../models/Account");
const Beneficiary = require("../models/Beneficiary");
const Transaction = require("../models/Transaction");
const { success } = require("../utils/apiResponse");
const { minimumBalance, dailyTransferLimit, suspiciousThreshold } = require("../utils/businessRules");

async function transfer(req, res) {
  const { fromAccountId, toAccountNumber, amount } = req.body;
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    const err = new Error("Transfer amount must be greater than zero"); err.statusCode = 400; err.errorCode = "VALIDATION_ERROR"; throw err;
  }

  const source = await Account.findOne({ _id: fromAccountId, userId: req.user._id });
  if (!source) {
    const err = new Error("Source account not found or not owned by user"); err.statusCode = 403; err.errorCode = "FORBIDDEN"; throw err;
  }
  if (source.status !== "active") {
    const err = new Error("Source account is not active"); err.statusCode = 409; err.errorCode = "BUSINESS_RULE_CONFLICT"; throw err;
  }

  const target = await Account.findOne({ accountNumber: toAccountNumber, status: "active" });
  if (!target) {
    const err = new Error("Destination account not found or inactive"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (source._id.toString() === target._id.toString()) {
    const err = new Error("Source and destination accounts must be different"); err.statusCode = 400; err.errorCode = "VALIDATION_ERROR"; throw err;
  }

  const beneficiary = await Beneficiary.findOne({
    accountId: source._id, beneficiaryAccountNumber: target.accountNumber, status: "active"
  });
  if (!beneficiary && source.userId.toString() !== target.userId.toString()) {
    const err = new Error("Destination is not a trusted beneficiary"); err.statusCode = 403; err.errorCode = "BENEFICIARY_REQUIRED"; throw err;
  }

  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);
  const dailyOut = await Transaction.aggregate([
    { $match: { accountId: source._id, type: "transfer_out", createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const alreadyTransferred = dailyOut[0]?.total || 0;
  if (alreadyTransferred + value > dailyTransferLimit(source)) {
    const err = new Error("Daily transfer limit exceeded");
    err.statusCode = 409; err.errorCode = "DAILY_LIMIT_EXCEEDED"; throw err;
  }

  const minBal = minimumBalance(source.type);
  if (source.balance - value < minBal) {
    const err = new Error(`Transfer would violate the minimum balance requirement of ${minBal}`);
    err.statusCode = 409; err.errorCode = "INSUFFICIENT_FUNDS"; throw err;
  }

  const session = await mongoose.startSession();
  let reference;
  try {
    await session.withTransaction(async () => {
      const lockedSource = await Account.findOne({ _id: source._id }).session(session);
      const lockedTarget = await Account.findOne({ _id: target._id }).session(session);
      if (!lockedSource || !lockedTarget || lockedSource.status !== "active" || lockedTarget.status !== "active") {
        const err = new Error("Account status changed during transfer"); err.statusCode = 409; err.errorCode = "BUSINESS_RULE_CONFLICT"; throw err;
      }
      if (lockedSource.balance - value < minimumBalance(lockedSource.type)) {
        const err = new Error("Insufficient available balance after minimum-balance rule"); err.statusCode = 409; err.errorCode = "INSUFFICIENT_FUNDS"; throw err;
      }

      lockedSource.balance -= value;
      lockedTarget.balance += value;
      await lockedSource.save({ session });
      await lockedTarget.save({ session });

      reference = `TXN-${crypto.randomUUID()}`;
      const flagged = value >= suspiciousThreshold();
      await Transaction.create([{
        accountId: lockedSource._id, type: "transfer_out", amount: value,
        balanceAfter: lockedSource.balance, relatedAccount: lockedTarget._id,
        flagged, flagReason: flagged ? `Amount >= suspicious threshold ${suspiciousThreshold()}` : null,
        transferReference: reference
      }, {
        accountId: lockedTarget._id, type: "transfer_in", amount: value,
        balanceAfter: lockedTarget.balance, relatedAccount: lockedSource._id,
        flagged, flagReason: flagged ? `Amount >= suspicious threshold ${suspiciousThreshold()}` : null,
        transferReference: reference
      }], { session, ordered: true });   
     });
  } finally {
    await session.endSession();
  }

  return success(res, 201, "Transfer completed successfully", { reference, amount: value });
}

async function listTransactions(req, res) {
  const account = await Account.findById(req.params.accountId);
  if (!account) {
    const err = new Error("Account not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (req.user.role === "customer" && account.userId.toString() !== req.user._id.toString()) {
    const err = new Error("You can view only your own transactions"); err.statusCode = 403; err.errorCode = "FORBIDDEN"; throw err;
  }
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const data = await Transaction.find({ accountId: account._id }).sort({ createdAt: -1 }).limit(limit);
  return success(res, 200, "Transactions fetched", data);
}

async function deposit(req, res) {
  const { accountId, amount } = req.body;
  const value = Number(amount);
  const account = await Account.findOne({ _id: accountId, userId: req.user._id });
  if (!account) { const e=new Error("Account not found"); e.statusCode=404; e.errorCode="NOT_FOUND"; throw e; }
  if (account.status !== "active") { const e=new Error("Only active accounts can receive deposits"); e.statusCode=409; e.errorCode="BUSINESS_RULE_CONFLICT"; throw e; }
  account.balance += value;
  await account.save();
  const tx = await Transaction.create({
    accountId: account._id, type: "deposit", amount: value, balanceAfter: account.balance,
    flagged: value >= suspiciousThreshold(), flagReason: value >= suspiciousThreshold() ? `Amount >= suspicious threshold ${suspiciousThreshold()}` : null
  });
  return success(res, 201, "Deposit recorded", tx);
}

async function withdraw(req, res) {
  const { accountId, amount } = req.body;
  const value = Number(amount);
  const account = await Account.findOne({ _id: accountId, userId: req.user._id });
  if (!account) { const e=new Error("Account not found"); e.statusCode=404; e.errorCode="NOT_FOUND"; throw e; }
  if (account.status !== "active") { const e=new Error("Only active accounts can withdraw"); e.statusCode=409; e.errorCode="BUSINESS_RULE_CONFLICT"; throw e; }
  if (account.balance - value < minimumBalance(account.type)) {
    const e=new Error("Withdrawal violates the minimum balance requirement"); e.statusCode=409; e.errorCode="INSUFFICIENT_FUNDS"; throw e;
  }
  account.balance -= value;
  await account.save();
  const tx = await Transaction.create({
    accountId: account._id, type: "withdrawal", amount: value, balanceAfter: account.balance,
    flagged: value >= suspiciousThreshold(), flagReason: value >= suspiciousThreshold() ? `Amount >= suspicious threshold ${suspiciousThreshold()}` : null
  });
  return success(res, 201, "Withdrawal recorded", tx);
}

module.exports = { transfer, listTransactions, deposit, withdraw };
