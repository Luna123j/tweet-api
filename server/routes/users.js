var express = require('express');
var router = express.Router();

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

router.post('/', (req, res) => {
  const user = req.body;
  users.createUser(user.username,user.password).then(data => {
    console.log(data);
    res.json({message: data});
  })
});


module.exports = router;

