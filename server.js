require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");

const users = [];

app.get("/post", authToken, (req, res) => {
  res.render("home.ejs");
});

app.get("/", (req, res) => {
  res.render("register.ejs");
});

app.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
    };
    users.push(user);
    res.redirect("/login");
  } catch (err) {
    res.redirect("/");
    console.log(err);
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  const user = users.find((user) => user.email === req.body.email);
  if (user == null) {
    return res.redirect("/");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

      res.redirect("/post");
    } else {
      res.send("Wrong Password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

function authToken(req, res, next) {
  console.log("hi");
  const authHeader = req.headers;
  const token = authHeader;
  console.log(authHeader);
  if (token == null) {
    return res.status(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403);
      }
      req.user = user;
      next();
      console.log("authtoken");
    });
  }
}

app.listen(3000);
