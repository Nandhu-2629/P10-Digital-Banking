const router = require("express").Router();
const { body, param } = require("express-validator");
const c = require("../controllers/beneficiaryController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");

router.post("/", protect,
  body("accountId").isMongoId(),
  body("beneficiaryAccountNumber").trim().notEmpty(),
  body("nickname").trim().isLength({ min: 1, max: 50 }),
  validate, asyncHandler(c.addBeneficiary)
);
router.get("/:accountId", protect, param("accountId").isMongoId(), validate, asyncHandler(c.listBeneficiaries));
router.delete("/:id", protect, param("id").isMongoId(), validate, asyncHandler(c.deleteBeneficiary));

module.exports = router;
