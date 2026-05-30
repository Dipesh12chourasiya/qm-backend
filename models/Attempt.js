const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },

    selectedOption: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
    },

    score: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "IN_PROGRESS",
        "COMPLETED",
        "AUTO_SUBMITTED",
      ],
      default: "IN_PROGRESS",
    },

    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Attempt",
  attemptSchema
);