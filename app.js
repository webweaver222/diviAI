var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

//db connect

mongoose.connect("mongodb://localhost:27017/diviai_db", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var profileRouter = require("./routes/profile");
var friendsRouter = require("./routes/friends");
var postRouter = require("./routes/post");

var app = express();

var corsOptions = {
  origin: "http://localhost",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/friends", friendsRouter);
app.use("/post", postRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.log(err);

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
