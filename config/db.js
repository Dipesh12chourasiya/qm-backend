const mongoose = require('mongoose');

const connectDB = async () => {
  // console.log("MONGO_URI:", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    // console.error("MongoDB Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
