const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const passwordValidatorOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};



exports.signup = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || !validator.isEmail(email)) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  if (validator.isStrongPassword(password, passwordValidatorOptions)) {
    bcrypt.hash(password, 10).then((hash) => {
      const user = new User({
        email: email,
        password: hash,
      });
      user.save().then(() => {
        res.status(201).json({ message: "User created successfully" });
      });
    });
  } else {
    return res.status(400).json({ error: "Password is not strong enough" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  bcrypt
    .compare(password, user.password)
    .then((result) => {
      if (result !== true) {
        return res.status(401).json({ error: "Invalid password" });
      } else {
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, process.env.Secret_Key, { expiresIn: "24h" }),
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
