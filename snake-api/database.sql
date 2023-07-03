CREATE TABLE usr (
	id serial PRIMARY KEY,
	username varchar(30) UNIQUE NOT NULL,
	created_on timestamp DEFAULT NOW(),
	max_score integer DEFAULT 0 NOT NULL
);

SELECT * FROM usr;