var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const users = require('../db/queries/users');


router.get('/', (req, res) => {
  users.getAllUsers().then(data => {
    console.log(data);
    return res.status(200).json({ users: data });
  })
});

router.get('/:id', (req, res) => {
  users.getUserById(req.params.id).then(data => {
    console.log(data);
    return res.json({ users: data });
  })
});

//user registration
router.post('/register', (req, res) => {
  const user = req.body;
  // console.log(req.body)

  //check edge cases
  if (req.session.userId) {
    return res.status(400).json({ message: "Already logged in" })
  }
  if (!user.username) {
    return res.status(404).json({ message: "Please enter valid username" });
  }

  if (!user.password) {
    return res.status(404).json({ message: "Please enter valid password" });
  }

  //check if username exist
  users.getUserByusername(user.username)
    .then((data) => {
      if (data.length > 0) {
        return res.status(404).json({ message: "Username exist" });
      } else {

        //if a unique username, create user
        users.createUser(user.username, bcrypt.hashSync(user.password, 10))
          .then((data) => {
            // console.log(data);
            req.session.userId = data[0].id;
            return res.status(200).json({ message: "Successfull registered" });
          })
      }
    })

});

//user login
router.post('/login', (req, res) => {
  const user = req.body;
  // console.log(req.session);

  //check cookie session
  if (req.session.userId) {
    return res.status(400).json({ message: "Already logged in" })
  }

  //check if user exist in database
  users.getUserByusername(user.username)
    .then(data => {
      if (data.length < 1) {
        return res.status(404).json({ message: "User dose not exist" })
      }

      // console.log("wwwwwwwwwwwww",bcrypt.compareSync(user.password,data[0].password))
      //compare password with the one in database
      if (!bcrypt.compareSync(user.password,data[0].password)) {
        return res.status(400).json({ message: "Wrong Password" })
      }

      //set session
      req.session.userId = data[0].id;
      return res.status(200).json({ message: "Success logged in" });
    })
})

//user logout
router.post("/logout", (req, res) => {
  req.session = null; //clear all cookies
  res.status(200).json({ message: "logged out" });
});

module.exports = router;

