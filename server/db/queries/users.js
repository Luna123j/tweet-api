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
  return db.query("INSERT INTO users (username, password) VALUES ($1,$2) RETURNING id", [username, password]).then(data => {
    return data.rows;
  })
}



module.exports = { getAllUsers, getUserById,getUserByusername, createUser }