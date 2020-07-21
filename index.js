var express = require("express");
var bodyParser = require("body-parser");
var env = require("dotenv");
var cors = require("cors");
var app = express();
var sequelize = require("./config/database");
env.config();
var port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

var userRoute = require("./routes/user");
var itemRoute = require("./routes/item");

app.use("/app/user", userRoute);
app.use("/app", itemRoute);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res
      .status(401)
      .json({ error: "Unauthorized Error", message: "invalid token..." });
  }
});

sequelize
  .sync()
  .then((result) => {
    console.log("DB setup succesfully");
    app.listen(port, () => {
      console.log("Server is running on PORT:" + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
