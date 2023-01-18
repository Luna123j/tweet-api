const { assert } = require('chai');
const users = require('../db/queries/users.js');

const testUser1 = {id:1, username:'rick.sandchez@gmail.com',password: 'picklerick'};
const testUser2 ={username: 'test', password: 'test'};

describe('createUser', function() {
  it('should return user exist', function() {
    const message = users.createUser(testUser1.username,testUser1.password)
    assert(message, "User exist");
  });

  it('should return user added successfully ', function() {
    const message = users.createUser(testUser2.username,testUser2.password)
    assert(message, "User added");
  });
  
});