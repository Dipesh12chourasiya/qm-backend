const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  createQuestion,
  getMyQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

router.post(
  "/",
  protect,
  authorize("COMPANY"),
  createQuestion
);

router.get(
  "/my",
  protect,
  authorize("COMPANY"),
  getMyQuestions
);

router.get(
  "/:id",
  protect,
  authorize("COMPANY"),
  getQuestionById
);

router.put(
  "/:id",
  protect,
  authorize("COMPANY"),
  updateQuestion
);

router.delete(
  "/:id",
  protect,
  authorize("COMPANY"),
  deleteQuestion
);

module.exports = router;