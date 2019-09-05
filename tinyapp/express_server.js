const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
}


// FUNCTIONS

function generateRandomString() { 
  let result = [];
  let arrayString = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m","n", "o", "p","q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  for (let i = 0; i < 6; i++) {
    let x = Math.floor(Math.random() * 35)
    result.push(arrayString[x]);

  }
  return result.join('')
}

function emailLookup(emailCheck) {
  for (let par in users) {
    if (emailCheck === users[par].email) {
      return users[par];
    }
  }
  return false;
}

function urlsForUser(userID) {
  let newObject = {};
  for (let par in urlDatabase) {
    if (urlDatabase[par].userID === userID) {
      newObject[par] = {
        longURL: urlDatabase[par].longURL,
        userID: userID
      }
    }
  }
  return newObject;
}

// GETS

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  if (req.cookies["username"]) {
    res.render("urls_new", templateVars );
  }
  else { // Redirect if not loggedin
    res.render("urls_login", templateVars)
  }
});

app.get("/urls/:shortURL", (req, res) => {

  let userID = urlDatabase[req.params.shortURL].userID 
 
  let templateVars = { 
    longURL: urlDatabase[req.params.shortURL].longURL,
    shortURL: req.params.shortURL, 
    username: req.cookies["username"], };
    res.render("urls_show", templateVars);

    //  if (users[userID].email === templateVars.username) { 
    //    res.render("urls_show", templateVars);
    //  }
    //  else{
    //    res.status(401).send("You do not have access");
    //  }

});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  let user = req.cookies["username"];
  if (emailLookup(user)) {
    user = emailLookup(user).id
  }
  let templateVars = {
    urls: urlsForUser(user),
    username: req.cookies["username"]
  }

  if (req.cookies["username"]) {
    res.render("urls_index", templateVars );
  }
  else { // Redirect if not loggedin
    res.render("urls_login", templateVars)
  }
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  }

  res.render("urls_register", templateVars);
})

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  }
  res.render("urls_login", templateVars);
})


app.post("/urls", (req, res) => { // creating 6 alphanumeric and adds to db
  let genURL = generateRandomString();

  urlDatabase[genURL] = {
    longURL: req.body.longURL,
    userID: emailLookup(req.cookies["username"]).id
};
  res.redirect("/urls/" + genURL);         
});

app.post("/urls/:shortURL/delete", (req, res) => { // delete post
  shortURL = req.params.shortURL; 
  let userID = emailLookup(req.cookies["username"]).id
  let urlID = urlDatabase[shortURL].userID;
  if (userID === urlID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls")
  }
  else {
    res.status(403).send("No access")
  }
}) 

app.post("/urls/:shortURL", (req, res) => { // update the long URL
  
  shortURL = req.params.shortURL;
  let userID = emailLookup(req.cookies["username"]).id
  let urlID = urlDatabase[shortURL].userID;
  if (userID === urlID) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls")
  }
  else {
    res.status(403).send("No access")
  }
})

app.post("/clearCookie", (req, res) => { // clear cookies
  res.clearCookie("username");
  res.redirect("/urls")
})

app.post("/register", (req, res) => { // register users to the database
let genID = generateRandomString();
let em = req.body.email;
if (em === "" || req.body.password === "" || emailLookup(em).email === em) {
  res.status(400).send("STATUS: 400. Please go back and enter a unique email and password!!");
}
else {
  users[genID] = {
    id: genID,
    email: req.body.email,
    password: req.body.password
  }
  let username = users[genID].email;
  res.cookie("username", username);
  res.redirect("/urls")
}
})

app.post("/login", (req, res) => { //login into database
  let objectID = emailLookup(req.body.email);
  if(objectID.email === req.body.email && objectID.password === req.body.password) {
    res.cookie("username", objectID.email)
    res.redirect("/urls")
  }
  else {
    res.status(403).send("STATUS: 403. Please re-login");
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

