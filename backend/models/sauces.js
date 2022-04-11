const mongoose = require("mongoose");

const saucesSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: File, required: true },
});

module.exports = mongoose.model("Sauces", saucesSchema);
