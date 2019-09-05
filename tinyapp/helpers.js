
//functions

function generateRandomString() { 
  let result = [];
  let arrayString = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m","n", "o", "p","q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  for (let i = 0; i < 6; i++) {
    let x = Math.floor(Math.random() * 35)
    result.push(arrayString[x]);

  }
  return result.join('')
}

function emailLookup(emailCheck, users) {
  for (let par in users) {
    if (emailCheck === users[par].email) {
      return users[par];
    }
  }
  return false;
}

function urlsForUser(userID, urlDatabase) {
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

module.exports = { urlsForUser, emailLookup, generateRandomString };