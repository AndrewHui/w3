function generateRandomString() {
  let count = 0;
  let result = [];
  let arrayString = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m","n", "o", "p","q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  console.log(arrayString.length)
  for (let i = 0; i < 6; i++) {
    let x = Math.floor(Math.random() * 35)
    result.push(arrayString[x]);

  }
  return result.join('')
}

console.log(generateRandomString())