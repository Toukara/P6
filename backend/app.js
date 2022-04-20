require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mogoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(mogoSanitize());
app.use(cors());

const apiRoutes = require("./routes/api.js");

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api", (req, res, next) => {
  apiLimiter;
  next();
});
app.use("/api", apiRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
