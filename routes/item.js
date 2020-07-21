var express = require("express");
var router = express.Router();

const itemController = require("../controllers/itemController");
const userController = require("../controllers/userController");

router.post("/sites", userController.requireSignIn, itemController.addItem);

router.get(
  "/sites/list",
  userController.requireSignIn,
  itemController.getItemByUserId
);

module.exports = router;
