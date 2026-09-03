const router = require("express").Router();
const { body } = require("express-validator");
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");

router.post("/register",
  body("name").trim().isLength({ min: 2, max: 80 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("accountType").optional().isIn(["savings", "current"]),
  validate, asyncHandler(register)
);
router.post("/login",
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  validate, asyncHandler(login)
);
router.get("/me", protect, asyncHandler(me));

module.exports = router;
