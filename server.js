const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();


const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");


const app = express();

// middlewares
app.use(cors());
app.use(express.json());


//routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);


app.get("/", (req, res) => {
  res.send("Backend is working!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));