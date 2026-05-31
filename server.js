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

/*
CORS CONFIG (PRODUCTION SAFE)
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://qm-frontend-eight.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// handle preflight requests
app.options("*", cors());

/*
MIDDLEWARES
*/

app.use(express.json());

/*
ROUTES
*/

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);


app.get("/", (req, res) => {
  res.send("Backend is working!");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});