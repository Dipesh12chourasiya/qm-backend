const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const testRoutes = require("./routes/testRoutes");
const attemptRoutes = require("./routes/attemptRoutes");

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://qm-frontend-eight.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false); // DO NOT throw error
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);


app.get("/", (req, res) => {
  res.send("Backend is working!");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});