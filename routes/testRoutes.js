const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  createTest,
  getAllTests,
  getTestById,
  registerForTest,
  getMyCreatedTests,
  activateTest,
} = require("../controllers/testController");

/*
Company Routes
*/
router.post(
  "/",
  protect,
  authorize("COMPANY"),
  createTest
);

router.get(
  "/my",
  protect,
  authorize("COMPANY"),
  getMyCreatedTests
);

router.patch(
  "/:id/activate",
  protect,
  authorize("COMPANY"),
  activateTest
);

/*
Student Routes
*/
router.post(
  "/:id/register",
  protect,
  authorize("USER"),
  registerForTest
);

/*
Public Routes
*/
router.get("/", getAllTests);

router.get("/:id", getTestById);

module.exports = router;