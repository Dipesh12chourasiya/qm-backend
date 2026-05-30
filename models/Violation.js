const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema(
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

    violationType: {
      type: String,
      enum: [
        "TAB_SWITCH",
        "CAMERA_OFF",
        "MULTIPLE_FACES",
        "NO_FACE_DETECTED",
        "FULLSCREEN_EXIT",
        "COPY_PASTE_ATTEMPT",
      ],
      required: true,
    },

    evidenceUrl: {
      type: String,
      default: "",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Violation",
  violationSchema
);