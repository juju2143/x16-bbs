-- Create a new sqlite3 database named data.db here
-- Once you created an account for yourself you can set sysop to 1 in the users table

CREATE TABLE "users" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"sysop"	INTEGER NOT NULL DEFAULT 0,
	"email"	TEXT NOT NULL,
	"displayname"	TEXT,
	"website"	TEXT,
	PRIMARY KEY("id")
)