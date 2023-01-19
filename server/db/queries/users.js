const db = require('../../configs/db.config');

const getAllUsers = () => {
  return db.query("SELECT * FROM users;").then(data => {
    return data.rows;
  })
}

const getUserById = id => {
  return db.query("SELECT * FROM users WHERE id = $1", [id]).then(data => {
    return data.rows;
  })
}

const getUserByusername = username => {
  return db.query("SELECT * FROM users WHERE username = $1", [username]).then(data => {
    return data.rows;
  })
}

const createUser = (username, password) => {

  if (!username) {
    return "Please enter valid username";
  }

  if (!password) {
    return "Please enter valid password";
  }

  //check if username exist
  if (getUserByusername(username) != null) {
    return "Username exist";
  }

  return db.query("INSERT INTO users (username, password) VALUES ($1,$2) RETURN id", [username, password]).then(data => {
    return {message:"User added",id: data.id};
  })
}



module.exports = { getAllUsers, getUserById,getUserByusername, createUser }