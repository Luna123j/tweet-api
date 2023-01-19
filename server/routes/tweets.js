var express = require('express');
var router = express.Router();
const tweets = require('../db/queries/tweets');


router.get('/', (req, res) => {
  tweets.getAllTweets().then(data => {
    return res.status(200).json({ tweets: data });
  })
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  tweets.getTweetsById(id).then(data => {
    return res.status(200).json({ tweets: data });
  })
});

router.post('/create', (req, res) => {
  const user_id = req.body.user_id;
  const text = req.body.text;

  if(!text){
    return res.status(400).json({message:"Please Enter a tweet"})
  }
  tweets.createTweet(text, user_id).then(data => {
    return res.status(200).json({ tweet: data });
  })
})

router.put('/update/:id', (req, res) => {
  const tweet_id=req.params.id;
  const text = req.body.text;
  tweets.updateTweet(text,tweet_id).then(data => {
    return res.status(200).json({ tweet: data });
  })
})

router.delete('/delete/:id', (req, res) => {
  const tweet_id=req.params.id;
  tweets.deleteTweet(tweet_id).then(data => {
    return res.status(200).json({ Message: "deleted !" });
  })
})

module.exports = router;