const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.js");

const userController = require("../controllers/user.js");
const saucesController = require("../controllers/sauces.js");

const multer = require("../middleware/multerConfig.js");

router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);

router.get("/sauces", auth, saucesController.getAllSauces);
router.get("/sauces/:id", auth, saucesController.getOneSauce);

router.put("/sauces/:id", auth, saucesController.editSauce);
router.delete("/sauces/:id", auth, saucesController.deleteSauce);
router.post("/sauces", auth, multer, saucesController.createSauce);

router.post("/sauces/:id/like", auth, saucesController.likeSauce);

module.exports = router;
