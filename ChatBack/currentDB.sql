CREATE TABLE IF NOT EXISTS users (
    "userId" SERIAL PRIMARY KEY NOT NULL,
    "firstName" varchar(30) NOT NULL,
    "lastName" varchar(30) NOT NULL,
    "userName" varchar(30) NOT NULL,
    "email" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL
); 

CREATE TABLE IF NOT EXISTS chats (
    "chatId" SERIAL PRIMARY KEY NOT NULL,
    "firstUserId" integer NOT NULL,
    "secondUserId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS blockedusers (
    "ownerUserId" integer NOT NULL,
    "blockedUserId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS textmessages (
    "messageId" SERIAL PRIMARY KEY NOT NULL,
    "chatId" integer NOT NULL,
    "body" text NOT NULL,
    "ownerId" integer NOT NULL,
    "ifGetterRead" boolean NOT NULL DEFAULT FALSE,
    "isForwarded" boolean NOT NULL DEFAULT FALSE,
    "forwardedFromUser" integer,
    "dateCreated" timestamp NOT NULL DEFAULT NOW(),
    "isEdited" boolean NOT NULL DEFAULT FALSE,
    "lastEdited" timestamp
    )