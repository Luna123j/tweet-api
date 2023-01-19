var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const users = require('../db/queries/users');


router.get('/', (req, res) => {
  users.getAllUsers().then(data => {
    console.log(data);
    res.status(200).json({users: data});
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
  console.log(req.body);
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  users.getUserByusername(user.username)
  .then(data => {
    console.log(data);
    if(data.length < 1){
      return res.status(404).json({message: "User dose not exist"})
    }

    if(!bcrypt.compareSync(data[0].password,hashedPassword)){
      return res.status(404).json({message: "Wrong Password"})
    }

    req.session.userId = data[0].id;
    return res.status(200).json({message: "logged in"});
  })
})

router.post('/register', (req, res) => {
  const user = req.body;
  users.createUser(user.username,bcrypt.hashSync(user.password, 10)).then(data => {
    console.log(data);
    req.session.userId = data.id;
    res.status(200).json({message: data});
  })
});


router.post("/logout", (req, res) => {
  req.session = null; //clear all cookies
  res.status(200).json({message: "logged out"});
});

module.exports = router;

