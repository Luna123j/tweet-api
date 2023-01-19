-- schema/02_create_users.sql
DROP TABLE IF EXISTS tweets CASCADE;
-- CREATE tweet
CREATE TABLE tweets (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);