const User = require("../models/user.js");
const bcrypt = require("bcrypt");

exports.signup = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      email: email,
      password: hash,
    });
    user.save().then(() => {
      res.status(201).json({ message: "User created successfully" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    let match = bcrypt.compare(password, user.password);

    if(match) {
      // { userId: string, token: string }
    }

  });
};
