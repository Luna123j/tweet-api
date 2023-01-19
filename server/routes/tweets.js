var express = require('express');
var router = express.Router();

module.exports = router;


router.get('/', (req, res) => {
  return res.json({tweet: "tweettttt"})
});


