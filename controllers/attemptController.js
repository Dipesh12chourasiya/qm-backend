const Attempt = require("../models/Attempt");
const Test = require("../models/Test");
const Question = require("../models/Question");
const Registration = require("../models/Registration");

/*
=========================================
Start Test
POST /api/attempts/start/:testId
=========================================
*/
const startTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const registration =
      await Registration.findOne({
        userId: req.user._id,
        testId,
      });

    if (!registration) {
      return res.status(400).json({
        success: false,
        message:
          "You are not registered for this test",
      });
    }

    const existingAttempt =
      await Attempt.findOne({
        userId: req.user._id,
        testId,
        status: {
          $in: [
            "IN_PROGRESS",
            "COMPLETED",
            "AUTO_SUBMITTED",
          ],
        },
      });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message:
          "You have already attempted this test",
      });
    }

    const attempt = await Attempt.create({
      userId: req.user._id,
      testId,
    });

    const questions = await Question.find({
      _id: {
        $in: test.questionIds,
      },
    }).select("-correctAnswer");

    res.status(201).json({
      success: true,
      message: "Test started successfully",
      attempt,
      questions,
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
=========================================
Save Answer
POST /api/attempts/answer
=========================================
*/
const saveAnswer = async (req, res) => {
  try {
    const {
      attemptId,
      questionId,
      selectedOption,
    } = req.body;

    const attempt =
      await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    if (
      attempt.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (
      attempt.status !== "IN_PROGRESS"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Test already submitted",
      });
    }

    const answerIndex =
      attempt.answers.findIndex(
        (answer) =>
          answer.questionId.toString() ===
          questionId
      );

    if (answerIndex !== -1) {
      attempt.answers[
        answerIndex
      ].selectedOption =
        selectedOption;
    } else {
      attempt.answers.push({
        questionId,
        selectedOption,
      });
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      message:
        "Answer saved successfully",
      answers: attempt.answers,
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
=========================================
Submit Test
POST /api/attempts/submit/:attemptId
=========================================
*/
const submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt =
      await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    if (
      attempt.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const test =
      await Test.findById(
        attempt.testId
      );

    const questions =
      await Question.find({
        _id: {
          $in: test.questionIds,
        },
      });

    let score = 0;

    let totalMarks = 0;

    questions.forEach(
      (question) => {
        totalMarks += question.marks;

        const answer =
          attempt.answers.find(
            (ans) =>
              ans.questionId.toString() ===
              question._id.toString()
          );

        if (
          answer &&
          answer.selectedOption ===
            question.correctAnswer
        ) {
          score += question.marks;
        }
      }
    );

    const percentage =
      totalMarks > 0
        ? (
            (score /
              totalMarks) *
            100
          ).toFixed(2)
        : 0;

    attempt.score = score;
    attempt.percentage =
      Number(percentage);

    attempt.status =
      "COMPLETED";

    attempt.submittedAt =
      new Date();

    await attempt.save();

    res.status(200).json({
      success: true,
      message:
        "Test submitted successfully",
      result: {
        score,
        totalMarks,
        percentage,
      },
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
=========================================
Get My Attempts
GET /api/attempts/my
=========================================
*/
const getMyAttempts = async (
  req,
  res
) => {
  try {
    const attempts =
      await Attempt.find({
        userId: req.user._id,
      })
        .populate(
          "testId",
          "title duration"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startTest,
  saveAnswer,
  submitTest,
  getMyAttempts,
};