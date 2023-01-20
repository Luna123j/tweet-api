## Social Media API
Social Media API that allows user registration, login/logout. User may create new tweet, edit it, retweet or like/unlike a tweet through this API.
## Getting Started

- install all dependencies
- create database and env file depends on evn.example
- npm run db:reset for reset database
- npm run dev for nodemon
- npm run start for express start

## Instruction

### User 

- POST /users/register -> (user register)
- POST /users/login  -> (user login)
- POST /users/logout  -> (user logout)

### Tweet

- GET /tweets/:id

(following route requires user login)
- POST /tweets/create -> (add a tweet for current user)
- PUT /tweets/update/:id -> (edit a tweet for current user)
- PUT /tweets/delete/:id -> (delete a tweet for current user)
- PUT /tweets/like/:id -> (like/unlike a tweet for current user)
- PUT /tweets/retweet/:id -> (retweet a tweet for current user)

### Dependencies

- express
- nodemon
- pg
- dotenv
- cookie-session
- bcryptjs

### Test

Test was done via Postman