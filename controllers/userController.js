const User = require("../models/User");
const bcrypt = require("bcryptjs");
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
var env = require("dotenv").config();

const signup = (req, res) => {
  const newUser = new User(req.body);
  if (newUser.username == "" || newUser.password == "") {
    return res.json({
      statusCode: 400,
      error: "Please provide with email as well as password",
    });
  }
  User.findOne({ where: { username: newUser.username } })
    .then((userRes) => {
      if (userRes) {
        return res.json({
          statusCode: 409,
          error: "User already exists with this email id",
        });
      }
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) {
            return res.json({
              statusCode: 406,
              error: "Error in hashing the password",
            });
          }
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              user.password = undefined;
              res.json({ statusCode: 200, user: user });
            })
            .catch((err) => {
              console.log("error is", err);
              res.json({
                statusCode: 500,
                error: "Error in signup",
              });
            });
        });
      });
    })
    .catch((err) => {
      console.log("Error in finding existing user");
      res.json({
        error: err,
      });
    });
};

const login = (req, res) => {
  const existUser = req.body;
  User.findOne({ where: { username: existUser.username } })
    .then((userRes) => {
      if (!userRes) {
        return res.json({
          statusCode: 404,
          error: "Not user exists with this email",
        });
      }
      bcrypt.compare(existUser.password, userRes.password, function (
        err,
        result
      ) {
        if (!result) {
          return res.json({ statusCode: 300, error: "UnAuthorized Error" });
        }

        userRes.isActive = true;
        userRes
          .save()
          .then(() => {
            // generate a token with user id and secret
            const token = jwt.sign(
              { id: userRes.id, accessKey: 0 },
              process.env.JWT_SECRET
            );

            // persist the token as 't' in cookie with expiry date
            res.cookie("t", token, { expire: new Date() + 9999 });

            userRes.password = undefined;
            return res.json({
              statusCode: 200,
              token: token,
              message: "User login successfully",
              userRes,
            });
          })
          .catch((err) => {
            console.log("Error in finding the user", err);
            res.json({
              statusCode: 500,
              error: err,
            });
          });
      });
    })
    .catch((err) => {
      console.log("Error in finding the user", err);
      res.json({
        error: err,
      });
    });
};

const signout = (req, res) => {
  var userId = req.query.userId;
  if (!userId) {
    return res.json({
      statusCode: 404,
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
  User.findOne({ where: { id: req.userProfile.id } })
    .then((user) => {
      user.isActive = false;
      user
        .save()
        .then(() => {
          res.clearCookie("t");
          return res.status(200).json({ message: "Signout successfully" });
        })
        .catch((err) => {
          return res.json({
            statusCode: 400,
            error: "Error in backend",
          });
        });
    })
    .catch((err) => {
      return res.json({
        statusCode: 400,
        error: "Error in backend",
      });
    });
};

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.auth &&
    req.userProfile &&
    req.auth.id === req.userProfile.id &&
    req.auth.accessKey == 0;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

const requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

module.exports = {
  signup,
  login,
  hasAuthorization,
  signout,
  requireSignIn,
};
