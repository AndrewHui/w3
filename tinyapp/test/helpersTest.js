const { assert } = require('chai');

const { emailLookup } = require('../helpers.js');

const testUsers = {
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

describe('emailLookup', function() {
  it('should return a user with valid email', function() {
    const user = emailLookup("user@example.com", testUsers).id
    const expectedOutput = "userRandomID";
    // Write your assert statement here 
    assert( user === expectedOutput, "user and expectedOutput should be the same");
  });
  it("should return undefined to test a non-existent email", function() {
    const user = emailLookup("", testUsers).id
    console.log(user)
    const expectedOutput = undefined;
    assert(user === expectedOutput, "user and expectedOutput should be the same")
  })
});