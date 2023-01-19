var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const users = require('../db/queries/users');


router.get('/', (req, res) => {
  users.getAllUsers().then(data => {
    console.log(data);
    res.json({users: data});
  })
});

router.get('/:id', (req, res) => {
  users.getUserById(req.params.id).then(data => {
    console.log(data);
    res.json({users: data});
  })
});


router.post('/login',(req,res)=>{
  const user = req.body;
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  users.getUserByusername(user.username).then(data => {
    if(data === null){
      res.json({message: "User dose not exist"})
    }

    if(!bcrypt.compareSync(data.password,hashedPassword)){
      res.json({message: "Wrong Password"})
    }

    req.session.userId = data.id;
  })
})

router.post('/register', (req, res) => {
  const user = req.body;
  users.createUser(user.username,bcrypt.hashSync(user.password, 10)).then(data => {
    console.log(data);
    req.session.userId = data.id;
    res.json({message: data});
  })
});


router.post("/logout", (req, res) => {
  req.session = null; //clear all cookies
  res.json({message: "logged out"});
});

module.exports = router;

