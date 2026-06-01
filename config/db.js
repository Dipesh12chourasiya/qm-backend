const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);

      console.log("Connected to MongoDB");
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connection established");
  return cached.conn;
};

module.exports = connectDB;



// const mongoose = require("mongoose");

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI);
// };  

// module.exports = connectDB;