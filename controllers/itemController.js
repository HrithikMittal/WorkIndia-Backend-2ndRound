var Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
var Item = require("../models/Item");

const addItem = (req, res) => {
  var userId = req.query.userId;
  if (!userId) {
    return res.json({
      statusCode: 400,
      error: "User Id is not avaliable",
      message: "Please provide your valid userId",
    });
  }
  const authorized = req.auth && req.auth.id == userId;
  if (!authorized) {
    return res.status(403).json({
      statusCode: 401,
      error: "User is not authorized",
    });
  }
  var newItem = new Item(req.body);
  if (
    newItem.password == undefined ||
    newItem.username == undefined ||
    newItem.website == undefined ||
    newItem.username == "" ||
    newItem.website == ""
  ) {
    return res.json({
      statusCode: 400,
      message: "Please provide all the details",
      error: "Incomplete imformation",
    });
  }

  newItem.userId = userId;
  const encryptedString = cryptr.encrypt(newItem.password);
  newItem.password = encryptedString;
  Item.findOne({
    where: {
      userId: userId,
      website: newItem.website,
      username: newItem.username,
    },
  })
    .then((itemRes) => {
      if (itemRes) {
        return res.json({
          statusCode: 302,
          message:
            "The website with this username already exits and if you want to edit please use edit API",
        });
      }
      newItem
        .save()
        .then(() => {
          res.json({
            statusCode: 200,
            message: "Your Item is successfully saved",
            status: "Success",
          });
        })
        .catch((err) => {
          console.log("error is ", err);
          return res.json({
            statusCode: 500,
            error: "Error in adding new item to DB",
            message: err.message,
          });
        });
    })
    .catch((err) => {
      console.log("error is ", err);
      return res.json({
        statusCode: 500,
        error: "Error in adding new item to DB",
        message: err.message,
      });
    });
};

const editItem = (req, res) => {
  var userId = req.query.userId;
  const authorized = req.auth && req.auth.id == userId;
  if (!authorized) {
    return res.status(403).json({
      statusCode: 403,
      error: "User is not authorized",
      message: "Please enter your own Id",
    });
  }
  var itemUp = req.body;
  if (
    itemUp.username == undefined ||
    itemUp.website == undefined ||
    itemUp.password == undefined ||
    itemUp.username == "" ||
    itemUp.website == ""
  ) {
    return res.json({
      statusCode: 404,
      message:
        "Data not found Please provide with the website and username correctly",
    });
  }

  Item.findOne({
    where: {
      userId: userId,
      username: itemUp.username,
      website: itemUp.website,
    },
  })
    .then((itemRes) => {
      if (!itemRes) {
        return res.json({
          statusCode: 404,
          message: "This website password does not exists!",
        });
      }
      const encryptedString = cryptr.encrypt(itemUp.password);
      itemRes.password = encryptedString;

      itemRes
        .save()
        .then(() => {
          return res.json({
            statusCode: 200,
            message: "Update successfully",
          });
        })
        .catch((err) => {
          console.log("Error is ", err);
          res.json({
            statusCode: 500,
            error: "Error in saving to the database",
            message: err.message,
          });
        });
    })
    .catch((err) => {
      console.log("Error is ", err);
      res.json({
        statusCode: 500,
        error: "Error in fetching from the database",
        message: err.message,
      });
    });
};

const getItemByUserId = (req, res) => {
  var userId = req.query.userId;
  const authorized = req.auth && req.auth.id == userId;
  if (!authorized) {
    return res.status(403).json({
      statusCode: 403,
      error: "User is not authorized",
      message: "Please enter your own Id",
    });
  }
  Item.findAll({ where: { userId: userId } })
    .then((items) => {
      if (!items) {
        return res.json({
          statusCode: 404,
          message: "There is no Website and password saved!",
        });
      }
      items.map((item) => {
        item.password = cryptr.decrypt(item.password);
      });
      return res.json({
        statusCode: 200,
        status: "Success",
        Items: items,
      });
    })
    .catch((err) => {
      console.log("Error is ", err);
      res.json({
        statusCode: 500,
        error: "Error in fetching from the database",
        message: err.message,
      });
    });
};

module.exports = {
  addItem,
  getItemByUserId,
  editItem,
};
