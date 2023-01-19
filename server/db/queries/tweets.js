const db = require('../../configs/db.config');

const getAllTweets = () => {
  return db.query("SELECT * FROM tweets;").then(data => {
    return data.rows;
  })
}

//read tweet
const getTweetsById = (id) => {
  return db.query("SELECT * FROM tweets WHERE id= $1;",[id]).then(data => {
    return data.rows;
  })
}

//create tweet
const createTweet = (text,user_id)=>{
  return db.query("INSERT INTO tweets (text,user_id) VALUES ($1, $2); RETURNING *",[text,user_id]).then(data => {
    return data.rows;
  })
}
//update tweet

const updateTweet = (text,tweet_id)=>{
  return db.query("UPDATE tweets SET text = $1 WHERE id = $2; RETURNING * ",[text,tweet_id]).then(data => {
    return data.rows;
  })
}
//delete tweet

const deleteTweet = (tweet_id)=>{
  return db.query("DELETE FROM tweets WHERE id = $1; ",[tweet_id]).then(data => {
    return data.rows;
  })
}
module.exports = { getAllTweets,getTweetsById,createTweet,updateTweet,deleteTweet }