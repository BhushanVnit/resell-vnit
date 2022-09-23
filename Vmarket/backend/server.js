if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Requiring Dependencies
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const flash = require("express-flash");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const auth = require("./src/middleware/auth");
//setup port
const port = process.env.Port || 8080;

const app = express();

// ========== added connection file ===========
require("./src/db/connection");

const Register = require("./src/models/registration");

// =========== setup a view engine ============== //
app.set("view-engine", "ejs");

//========== using different middlewares =============== //

app.use(express.urlencoded({ extended: false })); // for using information inside form //
app.use(express.json());

app.use(cookieParser());
app.use(flash()); // middleware for flash messages //

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(methodOverride("_method")); // overwrite the delete req over post req //

//===================== setting up different routes ==================== //

app.get("/", auth, (req, res) => {
  res.render("index.ejs", { name: req.body.name });
});


app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/logout", async (req, res) => {
    res.clearCookie("jwt");
  res.render("login.ejs");
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, user.password);

    const token = await user.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
      //secure: true
    });
    if (isMatch) {
      res.render("index.ejs", { name: user.name });
    } else {
      res.send("Invalid Login Details");
    }
  } catch (e) {
    res.status(400).send("Invalid Email");
  }
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/about", (req, res) => {
  res.render("about.ejs");
});
app.get("/sell", auth, (req, res) => {
  res.render("sell.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cnfpassword = req.body.cnfpassword;

    if (password === cnfpassword) {
      const registerUser = new Register({
        name: req.body.name,
        email: req.body.email,
        password: password,
      });

      const registered = await registerUser.save();
      res.redirect("/login");
    } else {
      res.send("Password incorrect");
    }
  } catch {
    console.log("Error in registration");
    res.redirect("/register");
  }
});

// app.delete('/logout', function (req, res) {
//     req.logout((req, err) => {
//         if (err) return err;
//     });
//     res.redirect('/');
// });

app.listen(port, () => {
  console.log(
    "listening on port :" + port + " & live at http://localhost:8080/"
  );
});
