const Test = require("../models/Test");
const Question = require("../models/Question");
const Registration = require("../models/Registration");
const Attempt = require("../models/Attempt");

/*
Create Test
POST /api/tests
Private (COMPANY)
*/

const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      startTime,
      endTime,
      questionIds,
      maxAttempts,
    } = req.body;

    // Verify all questions belong to company
    const questions = await Question.find({
      _id: { $in: questionIds },
      createdBy: req.user._id,
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "Some questions do not belong to you",
      });
    }

    const test = await Test.create({
      createdBy: req.user._id,
      title,
      description,
      duration,
      startTime,
      endTime,
      questionIds,
      totalQuestions: questionIds.length,
      maxAttempts,
    });

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      test,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
Get All Active Tests
GET /api/tests
Public / USER
*/
const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({
      status: "ACTIVE",
    })
      .populate("createdBy", "name companyName")
      .select("-questionIds");

    let userRegistrations = [];

    // only if user is logged in
    if (req.user?._id) {
      userRegistrations = await Registration.find({
        userId: req.user._id,
      }).select("testId");
    }

    const registeredTestIds = new Set(
      userRegistrations.map((r) => r.testId.toString())
    );

    const testsWithStatus = tests.map((test) => ({
      ...test.toObject(),
      isRegistered: registeredTestIds.has(test._id.toString()),
    }));

    res.status(200).json({
      success: true,
      count: tests.length,
      tests: testsWithStatus,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
Get Test By Id
GET /api/tests/:id
*/
const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(
      req.params.id
    ).populate({
      path: "questionIds",
      select:
        "-createdBy -__v",
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      test,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
Register For Test
POST /api/tests/:id/register
Private (USER)
*/
const registerForTest = async (req, res) => {
  try {
    const testId = req.params.id;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const existingRegistration =
      await Registration.findOne({
        userId: req.user._id,
        testId,
      });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message:
          "Already registered for this test",
      });
    }

    const registration =
      await Registration.create({
        userId: req.user._id,
        testId,
      });

    res.status(201).json({
      success: true,
      message:
        "Registered successfully",
      registration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
Get My Created Tests
GET /api/tests/my
Private (COMPANY)
*/
const getMyCreatedTests = async (
  req,
  res
) => {
  try {
    const tests = await Test.find({
      createdBy: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
Activate Test
PATCH /api/tests/:id/activate
Private (COMPANY)
*/
const activateTest = async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // ❌ prevent re-activation
    if (test.status === "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Test is already active",
      });
    }

    if (test.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Completed test cannot be activated",
      });
    }

    // optional validation
    if (new Date(test.startTime) > new Date(test.endTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test schedule",
      });
    }

    test.status = "ACTIVE";

    await test.save();

    res.status(200).json({
      success: true,
      message: "Test activated successfully",
      test,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const completeTest = async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    if (test.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Only ACTIVE tests can be completed",
      });
    }

    test.status = "COMPLETED";
    await test.save();

    res.status(200).json({
      success: true,
      message: "Test marked as completed",
      test,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/*
Get test analytics
GET /api/tests/:id/analytics
Private (COMPANY)
*/

const getTestAnalytics = async (req, res) => {
  try {
    const testId = req.params.id;

    // verify test belongs to company
    const test = await Test.findOne({
      _id: testId,
      createdBy: req.user._id,
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const registrations = await Registration.find({
      testId,
    }).populate("userId", "name email");

    const attempts = await Attempt.find({
      testId,
    });

    const attemptMap = {};

    attempts.forEach((attempt) => {
      attemptMap[attempt.userId.toString()] =
        attempt;
    });

    const analytics = registrations.map(
      (registration) => {
        const attempt =
          attemptMap[
            registration.userId._id.toString()
          ];

        return {
          userId:
            registration.userId._id,

          name:
            registration.userId.name,

          email:
            registration.userId.email,

          registeredAt:
            registration.createdAt,

          attempted:
            !!attempt,

          score:
            attempt?.score || 0,

          percentage:
            attempt?.percentage || 0,
        };
      }
    );

    res.status(200).json({
      success: true,
      testTitle: test.title,
      totalRegistered:
        registrations.length,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  registerForTest,
  getMyCreatedTests,
  activateTest,
  completeTest,
  getTestAnalytics
};