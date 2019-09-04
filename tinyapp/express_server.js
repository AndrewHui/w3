const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let result = [];
  let arrayString = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m","n", "o", "p","q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  for (let i = 0; i < 6; i++) {
    let x = Math.floor(Math.random() * 35)
    result.push(arrayString[x]);

  }
  return result.join('')
}

// app.get("*", (req, res) => {
//   let templateVars = {urls: urlDatabase}
//   res.redirect("/urls")
// });




app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL, 
    username: req.cookies["username"], };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]}
  res.render("urls_index", templateVars );
});


app.post("/urls", (req, res) => { // creating 6 alphanumeric and adds to db
  let genURL = generateRandomString();
  urlDatabase[genURL] = req.body.longURL;
  res.redirect("/urls/" + genURL);         
});

app.post("/urls/:shortURL/delete", (req, res) => { // delete post
  shortURL = req.params.shortURL; 
  delete urlDatabase[shortURL];
  res.redirect("/urls");
}) 

app.post("/urls/:shortURL", (req, res) => { // update the long URL
  shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
})

app.post("/login", (req, res) => { // LOGIN
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls")
})

app.post("/clearCookie", (req, res) => { // clear cookies
  res.clearCookie("username");
  res.redirect("/urls")
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

