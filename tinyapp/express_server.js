const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { urlsForUser, emailLookup, generateRandomString } = require('./helpers');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ["1"],
}));


// DATABASE

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


// GETS


app.get("/", (req, res) => {

  if (req.session["username"]) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }

});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.session["username"]
  };
  if (req.session["username"]) {
    res.render("urls_new", templateVars);
  } else { // Redirect if not loggedin
    res.render("urls_login", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
 
  let templateVars = {
    longURL: urlDatabase[req.params.shortURL].longURL,
    shortURL: req.params.shortURL,
    username: req.session["username"], };
  
  let shortURL = req.params.shortURL;
  let userID = emailLookup(req.session["username"], users).id;
  let urlID = urlDatabase[shortURL].userID;

  if (userID === urlID) {
    res.render("urls_show", templateVars);
  } else {
    res.status(403).send("No access");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect("http://" + longURL);
  } else {
    res.send("you broken");
  }
});

app.get("/urls", (req, res) => {
  let user = req.session["username"];
  if (emailLookup(user, users)) {
    user = emailLookup(user, users).id;
  }
  let templateVars = {
    urls: urlsForUser(user, urlDatabase),
    username: req.session["username"]
  };

  if (req.session["username"]) {
    res.render("urls_index", templateVars);
  } else { // Redirect if not loggedin
    res.send("you don't have access. please register.");
    //res.render("urls_login", templateVars)
  }
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.session["username"]
  };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.session["username"]
  };
  res.render("urls_login", templateVars);
});


// POST


app.post("/urls", (req, res) => { // creating 6 alphanumeric and adds to db
  let genURL = generateRandomString();

  urlDatabase[genURL] = {
    longURL: req.body.longURL,
    userID: emailLookup(req.session["username"], users).id
  };
  res.redirect("/urls/" + genURL);
});

app.post("/urls/:shortURL/delete", (req, res) => { // delete post
  let shortURL = req.params.shortURL;
  let userID = emailLookup(req.session["username"], users).id;
  let urlID = urlDatabase[shortURL].userID;
  if (userID === urlID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("No access");
  }
});

app.post("/u/:shortURL", (req, res) => { // update the long URL
  
  let shortURL = req.params.shortURL;
  let userID = emailLookup(req.session["username"], users).id;
  let urlID = urlDatabase[shortURL].userID;
  if (userID === urlID) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.status(403).send("No access");
  }
});

app.post("/clearCookie", (req, res) => { // clear cookies
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => { // register users to the database
  let genID = generateRandomString();
  let em = req.body.email;

  if (em === "" || req.body.password === "" || emailLookup(em, users).email === em) {
    res.status(400).send("STATUS: 400. Please go back and enter a unique email and password!!");
  } else {
    users[genID] = {
      id: genID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    let username = users[genID].email;
    req.session["username"] = username;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => { //login into database
  let objectID = emailLookup(req.body.email, users);
  if (objectID.email === req.body.email && bcrypt.compareSync(req.body.password, objectID.password)) {
    req.session["username"] = objectID.email;
    res.redirect("/urls");
  } else {
    res.status(403).send("STATUS: 403. Please re-login");
  }
});


// PORT

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

