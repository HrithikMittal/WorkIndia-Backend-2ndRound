const express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");

router.post("/", userController.signup);
router.post("/auth", userController.login);

router.post("/signout", userController.requireSignIn, userController.signout);

router.param("userId", userController.userById);
module.exports = router;
