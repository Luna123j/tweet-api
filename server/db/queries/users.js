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

const createUser = (username, password) => {

  //check if username exist
  return db.query("SELECT count(*) FROM users WHERE username = $1", [username]).then(data => {
    if (data.rows > 0) {
      return "User exist"
    }
    
    return db.query("INSERT INTO users (username, password) VALUES ($1,$2)", [username, password]).then(data => {
      return "User added"
    })
  })

}


module.exports = { getAllUsers, getUserById, createUser}