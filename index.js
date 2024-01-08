const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const { protect, restrict } = require("./Middleware/Authenticate");
const cors = require("cors");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const createError = require("http-errors");
const app = express();
const port = 8080;
const Task = require("./Model/Task");
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    Credential: true,
  })
);
app.use(express.static("public", { extensions: ["html", "css"] }));
app.use('/static'express.static(join(process.cwd(),"public")));
const connect = mongoose.connect("mongodb://localhost:27017/Task");
if (connect) {
  console.log("Connected To Mongo Succesful");
}

app.use("/api/v1/task", protect, require("./routes/TaskRoute"));

app.use("/api/v1/user", require("./routes/UserRoute"));

app.use((req, res, next) => {
  next(new createError.NotFound());
});
app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.send(error);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
