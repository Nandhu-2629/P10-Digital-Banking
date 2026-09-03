const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const generateAccountNumber = require("../utils/accountNumber");
const { success } = require("../utils/apiResponse");

async function register(req, res) {
  const { name, email, password, accountType = "savings" } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email is already registered");
    err.statusCode = 409; err.errorCode = "EMAIL_EXISTS";
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: "customer", kycStatus: "pending" });
  const account = await Account.create({
    userId: user._id,
    accountNumber: generateAccountNumber(),
    type: accountType,
    balance: 0,
    status: "pending"
  });

  return success(res, 201, "Customer registered and account application created", {
    userId: user._id,
    accountId: account._id,
    accountNumber: account.accountNumber,
    kycStatus: user.kycStatus,
    accountStatus: account.status
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401; err.errorCode = "INVALID_CREDENTIALS";
    throw err;
  }
  if (!user.isActive) {
    const err = new Error("User account is inactive");
    err.statusCode = 403; err.errorCode = "USER_INACTIVE";
    throw err;
  }
  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
  return success(res, 200, "Login successful", {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, kycStatus: user.kycStatus }
  });
}

async function me(req, res) {
  return success(res, 200, "Profile fetched", req.user);
}

module.exports = { register, login, me };
