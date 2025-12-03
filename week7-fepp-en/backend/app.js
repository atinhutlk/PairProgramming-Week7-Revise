require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const { unknownEndpoint,errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");

// Middlewares
app.use(cors());
app.use(express.json());

connectDB();
 
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
