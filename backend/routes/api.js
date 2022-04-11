const express = require('express')
const router = express.Router();

const authCtrl = require('../controllers/auth.js');

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);

router.get("/", (req, res) => {
    res.send("Hello World!");
})

module.exports = router;
