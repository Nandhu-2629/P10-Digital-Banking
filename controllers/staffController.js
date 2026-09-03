const Account = require("../models/Account");
const Approval = require("../models/Approval");
const Transaction = require("../models/Transaction");
const { success } = require("../utils/apiResponse");

async function pendingApprovals(req, res) {
  const accounts = await Account.find({ status: "pending" }).populate("userId", "name email kycStatus");
  return success(res, 200, "Pending approvals fetched", accounts);
}

async function flaggedTransactions(req, res) {
  const data = await Transaction.find({ flagged: true })
    .populate("accountId", "accountNumber userId")
    .populate("relatedAccount", "accountNumber")
    .sort({ createdAt: -1 });
  return success(res, 200, "Flagged transactions fetched", data);
}

async function dashboard(req, res) {
  const [pendingApprovalsCount, flaggedTransactionsCount, frozenAccountsCount, recentApprovals] = await Promise.all([
    Account.countDocuments({ status: "pending" }),
    Transaction.countDocuments({ flagged: true }),
    Account.countDocuments({ status: "frozen" }),
    Approval.find().sort({ createdAt: -1 }).limit(10).populate("accountId", "accountNumber").populate("staffId", "name email")
  ]);
  return success(res, 200, "Staff dashboard fetched", {
    pendingApprovalsCount, flaggedTransactionsCount, frozenAccountsCount, recentApprovals
  });
}

module.exports = { pendingApprovals, flaggedTransactions, dashboard };
