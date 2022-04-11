const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

const apiAuthRoutes = require("./routes/api.js");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`) , console.log("Connected to MongoDB");
    })
  )
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api/auth", apiAuthRoutes);

module.exports = app;
