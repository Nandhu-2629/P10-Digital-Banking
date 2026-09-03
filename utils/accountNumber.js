const crypto = require("crypto");

function generateAccountNumber() {
  return `AC${Date.now().toString().slice(-8)}${crypto.randomInt(1000, 9999)}`;
}
module.exports = generateAccountNumber;
