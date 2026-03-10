const express = require("express");
const app = express();
const path = require("path");
const routers = require("./src/routers");
const flash = require("connect-flash");
const session = require("express-session");
app.use(express.urlencoded());
app.use(flash());
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);
app.set("views", `${path.join(__dirname, "src", "views")}`);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(routers);
app.listen(3000, () => {
  console.log("Đang chạy với port 3000");
});
