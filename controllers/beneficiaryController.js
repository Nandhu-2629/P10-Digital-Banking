const Account = require("../models/Account");
const Beneficiary = require("../models/Beneficiary");
const { success } = require("../utils/apiResponse");

async function resolveOwnerAccount(userId, accountId) {
  const account = await Account.findOne({ _id: accountId, userId });
  if (!account) {
    const err = new Error("Source account not found or not owned by user");
    err.statusCode = 403; err.errorCode = "FORBIDDEN"; throw err;
  }
  return account;
}

async function addBeneficiary(req, res) {
  const { accountId, beneficiaryAccountNumber, nickname } = req.body;
  const owner = await resolveOwnerAccount(req.user._id, accountId);
  if (owner.status !== "active") {
    const err = new Error("Beneficiaries can be added only for active accounts");
    err.statusCode = 409; err.errorCode = "BUSINESS_RULE_CONFLICT"; throw err;
  }
  const target = await Account.findOne({ accountNumber: beneficiaryAccountNumber, status: "active" });
  if (!target) {
    const err = new Error("Beneficiary account does not exist or is not active");
    err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (target._id.toString() === owner._id.toString()) {
    const err = new Error("An account cannot be its own beneficiary");
    err.statusCode = 400; err.errorCode = "VALIDATION_ERROR"; throw err;
  }
  const beneficiary = await Beneficiary.create({ accountId: owner._id, beneficiaryAccountNumber, nickname });
  return success(res, 201, "Beneficiary added successfully", beneficiary);
}

async function listBeneficiaries(req, res) {
  await resolveOwnerAccount(req.user._id, req.params.accountId);
  const data = await Beneficiary.find({ accountId: req.params.accountId, status: "active" });
  return success(res, 200, "Beneficiaries fetched", data);
}

async function deleteBeneficiary(req, res) {
  const item = await Beneficiary.findById(req.params.id).populate("accountId");
  if (!item) {
    const err = new Error("Beneficiary not found"); err.statusCode = 404; err.errorCode = "NOT_FOUND"; throw err;
  }
  if (item.accountId.userId.toString() !== req.user._id.toString()) {
    const err = new Error("You can delete only your own beneficiary"); err.statusCode = 403; err.errorCode = "FORBIDDEN"; throw err;
  }
  item.status = "blocked";
  await item.save();
  return success(res, 200, "Beneficiary removed successfully", { id: item._id, status: item.status });
}

module.exports = { addBeneficiary, listBeneficiaries, deleteBeneficiary };
