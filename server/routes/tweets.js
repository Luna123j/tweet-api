var express = require('express');
var router = express.Router();
const tweets = require('../db/queries/tweets');
const users = require('../db/queries/users');

router.get('/', (req, res) => {
  tweets.getAllTweets().then(data => {
    return res.status(200).json({ tweets: data });
  })
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  tweets.getTweetsById(id).then(data => {
    if(data.length <1){
      return res.status(404).json({ message: "tweet id does not exist"});
    }
    return res.status(200).json({ tweets: data });
  })
});


router.post('/create', async (req, res) => {
  const user_id = req.session.userId;
  const text = req.body.text;
  let check;

  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  if(!text){
    return res.status(400).json({message:"Please Enter a tweet"})
  }

  try {
    check =  await users.getUserById(user_id)
  } catch (error) {
    return console.log(error)
  }

  if(check.length < 1){
    return res.status(400).json({message:"User does not exist"})
  }
  
  tweets.createTweet(text, user_id).then(data => {
    return res.status(200).json({ tweet: data });
  })
})

router.put('/update/:id', async (req, res) => {
  const tweet_id=req.params.id;
  const text = req.body.text;
  let check;
  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  if(!text){
    return res.status(400).json({message:"Please Enter a tweet"})
  }

  try {
    check =  await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  if(check.length<1){
    return res.status(400).json({message:"tweet does not exist"})
  }

  tweets.updateTweet(text,tweet_id).then(data => {
    return res.status(200).json({ tweet: data });
  })
})

router.delete('/delete/:id', async(req, res) => {
  const tweet_id=req.params.id;
  let check;

  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  try {
    check =  await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  if(check.length<1){
    return res.status(400).json({message:"tweet does not exist"})
  }

  tweets.deleteTweet(tweet_id).then(data => {
    return res.status(200).json({ Message: "deleted!" });
  })
})


//route to like/unlike tweet

router.put('/like', async(req, res) => {
  const user_id=req.session.userId;
  const tweet_id=req.body.tweet_id;
  let check;
  let checkUser;
  let checkLikeCondition;

  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  try {
    check =  await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  if(check.length<1){
    return res.status(400).json({message:"tweet does not exist"})
  }

  try {
    checkUser =  await users.getUserById(user_id)
  } catch (error) {
    return console.log(error)
  }

  if(checkUser.length < 1){
    return res.status(400).json({message:"User does not exist"})
  }


  try {
    checkLikeCondition =  await tweets.checkLikeCondition(tweet_id,user_id)
  } catch (error) {
    return console.log(error)
  }

  if(checkLikeCondition.length>0){
    tweets.unlikeTweet(tweet_id,user_id).then(data => {
      return res.status(200).json({ Message:"unliked",tweet: data });
    })
  }else{

    tweets.likeTweet(tweet_id,user_id).then(data => {
      return res.status(200).json({Message:"liked",tweet: data });
    })
  }


})

module.exports = router;