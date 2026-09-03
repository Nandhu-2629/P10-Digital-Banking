const Account = require("../models/Account");
const Approval = require("../models/Approval");
const Transaction = require("../models/Transaction");
const { success } = require("../utils/apiResponse");
const { minimumBalance } = require("../utils/businessRules");

async function listMyAccounts(req, res) {
  const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return success(res, 200, "Accounts fetched", accounts);
}

async function getAccount(req, res) {
  const account = await Account.findById(req.params.id);
  if (!account) {
    const err = new Error("Account not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (req.user.role === "customer" && account.userId.toString() !== req.user._id.toString()) {
    const err = new Error("You can access only your own account"); err.statusCode = 403; err.errorCode = "FORBIDDEN"; throw err;
  }
  return success(res, 200, "Account fetched", account);
}

async function updateAccount(req, res) {
  const account = await Account.findById(req.params.id);
  if (!account) {
    const err = new Error("Account not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (req.user.role === "customer" && account.userId.toString() !== req.user._id.toString()) {
    const err = new Error("You can update only your own account"); err.statusCode = 403; err.errorCode = "FORBIDDEN"; throw err;
  }
  if (account.status !== "pending") {
    const err = new Error("Only pending account applications can be edited"); err.statusCode = 409; err.errorCode = "BUSINESS_RULE_CONFLICT"; throw err;
  }
  if (req.body.type) account.type = req.body.type;
  await account.save();
  return success(res, 200, "Account updated successfully", { type: account.type, status: account.status });
}

async function approveAccount(req, res) {
  const { status, remarks } = req.body;
  const account = await Account.findById(req.params.id);
  if (!account) {
    const err = new Error("Account not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (!["Approved", "Rejected"].includes(status)) {
    const err = new Error("Status must be Approved or Rejected"); err.statusCode = 400; err.errorCode = "VALIDATION_ERROR"; throw err;
  }
  if (account.status !== "pending") {
    const err = new Error("Only pending accounts can be approved or rejected"); err.statusCode = 409; err.errorCode = "BUSINESS_RULE_CONFLICT"; throw err;
  }

  account.status = status === "Approved" ? "active" : "rejected";
  await account.save();

  await Approval.create({
    accountId: account._id,
    staffId: req.user._id,
    decision: status.toLowerCase(),
    remarks: remarks || ""
  });

  const User = require("../models/User");
  await User.findByIdAndUpdate(account.userId, { kycStatus: status === "Approved" ? "approved" : "rejected" });

  return success(res, 200, "Status updated successfully", { status: status });
}

async function freezeAccount(req, res) {
  const account = await Account.findById(req.params.id);
  if (!account) {
    const err = new Error("Account not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  account.status = "frozen";
  await account.save();
  return success(res, 200, "Account frozen successfully", { status: account.status });
}

async function unfreezeAccount(req, res) {
  const account = await Account.findById(req.params.id);
  if (!account) {
    const err = new Error("Account not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (account.status !== "frozen") {
    const err = new Error("Only frozen accounts can be unfrozen"); err.statusCode = 409; err.errorCode = "BUSINESS_RULE_CONFLICT"; throw err;
  }
  account.status = "active";
  await account.save();
  return success(res, 200, "Account unfrozen successfully", { status: account.status });
}

async function accountStatement(req, res) {
  const account = await Account.findById(req.params.id);
  if (!account) {
    const err = new Error("Account not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (req.user.role === "customer" && account.userId.toString() !== req.user._id.toString()) {
    const err = new Error("You can view only your own statement"); err.statusCode = 403; err.errorCode = "FORBIDDEN"; throw err;
  }
  const from = req.query.from ? new Date(req.query.from) : new Date("1970-01-01");
  const to = req.query.to ? new Date(req.query.to) : new Date();
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
    const err = new Error("Invalid date range"); err.statusCode = 400; err.errorCode = "VALIDATION_ERROR"; throw err;
  }
  const transactions = await Transaction.find({
    accountId: account._id, createdAt: { $gte: from, $lte: to }
  }).sort({ createdAt: 1 });
  return success(res, 200, "Account statement generated", {
    accountNumber: account.accountNumber,
    type: account.type,
    balance: account.balance,
    minimumBalance: minimumBalance(account.type),
    from, to, transactions
  });
}

module.exports = {
  listMyAccounts, getAccount, updateAccount, approveAccount,
  freezeAccount, unfreezeAccount, accountStatement
};
