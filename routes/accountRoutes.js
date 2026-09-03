const router = require("express").Router();
const { body, param } = require("express-validator");
const c = require("../controllers/accountController");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");

router.get("/", protect, asyncHandler(c.listMyAccounts));
router.get("/:id", protect, param("id").isMongoId(), validate, asyncHandler(c.getAccount));
router.put("/:id", protect, param("id").isMongoId(), body("type").optional().isIn(["savings","current"]), validate, asyncHandler(c.updateAccount));
router.put("/:id/approve", protect, authorize("bank_staff","admin"),
  param("id").isMongoId(), body("status").isIn(["Approved","Rejected"]), body("remarks").optional().isString().isLength({ max: 500 }),
  validate, asyncHandler(c.approveAccount)
);
router.put("/:id/freeze", protect, authorize("bank_staff","admin"), param("id").isMongoId(), validate, asyncHandler(c.freezeAccount));
router.put("/:id/unfreeze", protect, authorize("bank_staff","admin"), param("id").isMongoId(), validate, asyncHandler(c.unfreezeAccount));
router.get("/:id/statement", protect, param("id").isMongoId(), validate, asyncHandler(c.accountStatement));

module.exports = router;
