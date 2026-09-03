const router = require("express").Router();
const { body, param } = require("express-validator");
const c = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");

router.post("/transfer", protect,
  body("fromAccountId").isMongoId(),
  body("toAccountNumber").trim().notEmpty(),
  body("amount").isFloat({ gt: 0 }),
  validate, asyncHandler(c.transfer)
);
router.post("/deposit", protect,
  body("accountId").isMongoId(), body("amount").isFloat({ gt: 0 }),
  validate, asyncHandler(c.deposit)
);
router.post("/withdraw", protect,
  body("accountId").isMongoId(), body("amount").isFloat({ gt: 0 }),
  validate, asyncHandler(c.withdraw)
);
router.get("/:accountId", protect, param("accountId").isMongoId(), validate, asyncHandler(c.listTransactions));

module.exports = router;
