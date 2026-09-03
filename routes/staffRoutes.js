const router = require("express").Router();
const c = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

router.use(protect, authorize("bank_staff", "admin"));
router.get("/pending-approvals", asyncHandler(c.pendingApprovals));
router.get("/flagged-transactions", asyncHandler(c.flaggedTransactions));
router.get("/dashboard", asyncHandler(c.dashboard));

module.exports = router;
