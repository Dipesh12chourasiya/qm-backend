const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: "Question must have exactly 4 options",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "Aptitude",
        "Reasoning",
        "Verbal",
        "Technical",
      ],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    marks: {
      type: Number,
      default: 1,
    },

    negativeMarks: {
      type: Number,
      default: 0,
    },

    questionType: {
      type: String,
      enum: ["MCQ"],
      default: "MCQ",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);