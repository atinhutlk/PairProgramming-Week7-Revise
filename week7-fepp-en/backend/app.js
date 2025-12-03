require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const jobRouter = require("./routes/jobRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter"); 

const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");

// Middlewares
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/jobs", jobRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter); 

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
