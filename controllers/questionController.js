const Question = require("../models/Question");

/*
Create Question
POST /api/questions
Private (COMPANY)
*/
const createQuestion = async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctAnswer,
      category,
      difficulty,
      marks,
    } = req.body;

    const question = await Question.create({
      createdBy: req.user._id,

      questionText,
      options,
      correctAnswer,
      category,
      difficulty,
      marks,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
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
Get My Questions
GET /api/questions/my
Private (COMPANY)
*/
const getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
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
Get Question By Id
GET /api/questions/:id
Private (COMPANY)
*/
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // owner check
    if (
      question.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      question,
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
Update Question
PUT /api/questions/:id
Private (COMPANY)
*/
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (
      question.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedQuestion =
      await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
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
Delete Question
DELETE /api/questions/:id
Private (COMPANY)
*/
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (
      question.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
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
  createQuestion,
  getMyQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};