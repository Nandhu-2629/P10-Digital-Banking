const router = require("express").Router();
const c = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

router.post("/interest", protect, authorize("bank_staff", "admin"), asyncHandler(c.runInterestJob));

module.exports = router;
