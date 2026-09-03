const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { success } = require("../utils/apiResponse");

async function calculateInterest() {
  const annualRate = Number(process.env.ANNUAL_SAVINGS_INTEREST_RATE || 0.03);
  const today = new Date(); today.setHours(0,0,0,0);
  const accounts = await Account.find({ type: "savings", status: "active" });
  let processed = 0, totalInterest = 0;

  for (const account of accounts) {
    const last = account.lastInterestDate ? new Date(account.lastInterestDate) : null;
    if (last && last >= today) continue;
    if (account.balance <= 0) {
      account.lastInterestDate = new Date();
      await account.save();
      continue;
    }
    const interest = Number((account.balance * annualRate / 365).toFixed(2));
    if (interest <= 0) continue;
    account.balance += interest;
    account.lastInterestDate = new Date();
    await account.save();
    await Transaction.create({
      accountId: account._id, type: "interest", amount: interest,
      balanceAfter: account.balance
    });
    processed++;
    totalInterest += interest;
  }
  return { processed, totalInterest: Number(totalInterest.toFixed(2)), annualRate };
}

async function runInterestJob(req, res) {
  const result = await calculateInterest();
  return success(res, 200, "Interest calculation completed", result);
}

module.exports = { calculateInterest, runInterestJob };
