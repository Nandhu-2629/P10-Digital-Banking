function minimumBalance(type) {
  return type === "savings"
    ? Number(process.env.MIN_SAVINGS_BALANCE || 1000)
    : Number(process.env.MIN_CURRENT_BALANCE || 0);
}

function dailyTransferLimit(account) {
  return Number(account.dailyTransferLimit || process.env.DAILY_TRANSFER_LIMIT || 100000);
}

function suspiciousThreshold() {
  return Number(process.env.SUSPICIOUS_TRANSACTION_THRESHOLD || 50000);
}

module.exports = { minimumBalance, dailyTransferLimit, suspiciousThreshold };
