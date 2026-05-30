const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  startTest,
  saveAnswer,
  submitTest,
  getMyAttempts,
} = require("../controllers/attemptController");

router.post(
  "/start/:testId",
  protect,
  authorize("USER"),
  startTest
);

router.post(
  "/answer",
  protect,
  authorize("USER"),
  saveAnswer
);

router.post(
  "/submit/:attemptId",
  protect,
  authorize("USER"),
  submitTest
);

router.get(
  "/my",
  protect,
  authorize("USER"),
  getMyAttempts
);

module.exports = router;