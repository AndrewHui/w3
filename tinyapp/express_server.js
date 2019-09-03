const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { longURL: urlDatabase[req.params.shortURL],
  shortURL: req.params.shortURL };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase}
  res.render("urls_index", templateVars );
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

function generateRandomString() {
  let result = [];
  let arrayString = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m","n", "o", "p","q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  console.log(arrayString.length)
  for (let i = 0; i < 6; i++) {
    let x = Math.floor(Math.random() * 35)
    result.push(arrayString[x]);

  }
  return result.join('')
}

app.post("/urls", (req, res) => {
  let genURL = generateRandomString();
  urlDatabase[genURL] = req.body.longURL;
  console.log(genURL)
  res.redirect("/urls/" + genURL);         // Respond with 'Ok' (we will replace this)
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

