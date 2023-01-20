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
    if (data.length < 1) {
      return res.status(404).json({ message: "tweet id does not exist" });
    }
    return res.status(200).json({ tweets: data });
  })
});

//create a tweet
router.post('/create', async (req, res) => {
  const user_id = req.session.userId; //get user id from session
  const text = req.body.text; 
  let check;

  //check if user logged in
  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  //check if a empty tweet
  if (!text) {
    return res.status(400).json({ message: "Please Enter a tweet" })
  }

  //check if user exist
  try {
    check = await users.getUserById(user_id)
  } catch (error) {
    return console.log(error)
  }

  //if returned result is empty, user is not exist
  if (check.length < 1) {
    return res.status(400).json({ message: "User does not exist" })
  }

  //add tweet into database
  tweets.createTweet(text, user_id).then(data => {
    return res.status(200).json({ tweet: data });
  })
})

//updata a specific tweet
router.put('/update/:id', async (req, res) => {
  const tweet_id = req.params.id;
  console.log(req.params.id);
  const user_id = req.session.userId; //get user id from session
  const text = req.body.text;
  let check;

  //error condition handling
  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  if (!text) {
    return res.status(400).json({ message: "Please Enter a tweet" })
  }

  try {
    check = await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  // check if returned data is empty
  if (check.length < 1) {
    return res.status(400).json({ message: "tweet does not exist" })
  }else{
    //compare if the tweet belong to current user
    if(check[0].user_id != user_id){
      return res.status(400).json({ message: "no permission to edit this tweet" })
    }
  }

  //update tweet
  tweets.updateTweet(text, tweet_id).then(data => {
    return res.status(200).json({ tweet: data });
  })
})


//delete a specific tweet
router.delete('/delete/:id', async (req, res) => {
  const tweet_id = req.params.id;
  const user_id = req.session.userId; //get user id from session
  let check;

  //check different error case
  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  try {
    check = await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  // check if returned data is empty
  if (check.length < 1) {
    return res.status(400).json({ message: "tweet does not exist" })
  }else{
    //compare if the tweet belong to current user
    if(check[0].user_id != user_id){
      return res.status(400).json({ message: "no permission to edit this tweet" })
    }
  }

  //delete tweet from database
  tweets.deleteTweet(tweet_id).then(data => {
    return res.status(200).json({ Message: "deleted!" });
  })
})


//route to like/unlike tweet
router.put('/like/:id', async (req, res) => {
  const user_id = req.session.userId;
  const tweet_id = req.params.id;
  let check;
  let checkUser;
  let checkLikeCondition;

  //need login
  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  try {
    check = await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  if (check.length < 1) {
    return res.status(400).json({ message: "tweet does not exist" })
  }

  try {
    checkUser = await users.getUserById(user_id)
  } catch (error) {
    return console.log(error)
  }

  if (checkUser.length < 1) {
    return res.status(400).json({ message: "User does not exist" })
  }


  //check like condition of the tweet
  try {
    checkLikeCondition = await tweets.checkLikeCondition(tweet_id, user_id)
  } catch (error) {
    return console.log(error)
  }

  //if it is liked by current user then unlike it, otherwise like tweet
  if (checkLikeCondition.length > 0) {
    tweets.unlikeTweet(tweet_id, user_id).then(data => {
      return res.status(200).json({ Message: "unliked", tweet: data });
    })
  } else {

    tweets.likeTweet(tweet_id, user_id).then(data => {
      return res.status(200).json({ Message: "liked", tweet: data });
    })
  }

})

//retweet, copy tweet content then create new tweet
router.post('/retweet/:id', async (req, res) => {
  const user_id = req.session.userId;
  const tweet_id = req.params.id;
  let tweetInfo;
  let check;
  let checkUser;

  if (!user_id) {
    return res.status(400).json({ message: "Please Log in" })
  }

  try {
    check = await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  if (check.length < 1) {
    return res.status(400).json({ message: "tweet does not exist" })
  }

  try {
    checkUser = await users.getUserById(user_id)
  } catch (error) {
    return console.log(error)
  }

  if (checkUser.length < 1) {
    return res.status(400).json({ message: "User does not exist" })
  }

  //get tweet content
  try {
    tweetInfo = await tweets.getTweetsById(tweet_id)
  } catch (error) {
    return console.log(error)
  }

  // console.log(tweetInfo);
  //create new tweet
  tweets.createTweet(tweetInfo[0].text, user_id).then((data)=>{
    return res.status(200).json({ tweet: data });
  })

})


module.exports = router;