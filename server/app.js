var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const nodeCron = require("node-cron");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var orderRouter = require("./routes/orders");
var catagoriesRouter = require("./routes/categorys");
var productsRouter = require("./routes/products");
var commentsRouter = require("./routes/comment");

const { required } = require("nodemon/lib/config");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/order", orderRouter);
app.use("/category", catagoriesRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// Setup and start cron job
// nodeCron.schedule("0 0 1 * *", async () => {
//   try {
//     await InventoryController.updateInventory();
//     console.log("Inventory updated successfully");
//   } catch (error) {
//     console.error("Error updating inventory:", error);
//   }
// });

module.exports = app;
