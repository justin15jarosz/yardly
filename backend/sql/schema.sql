-- This script is intended to be run with the `psql` command-line tool.
-- It creates the 'yardly' database if it doesn't exist, then connects to it.

-- Create the database if it doesn't exist
-- \gexec is a psql meta-command that executes the query result
SELECT 'CREATE DATABASE yardly'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'yardly')\gexec

-- Connect to the 'yardly' database.
-- This is a psql meta-command.
\c yardly

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the Users table
CREATE TABLE IF NOT EXISTS "Users" (
  "UserId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "Email" VARCHAR(255) NOT NULL UNIQUE,
  "Password" VARCHAR(255) NOT NULL,
  "Name" VARCHAR(255) NOT NULL,
  "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "IsVerified" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create the Lawns table
CREATE TABLE IF NOT EXISTS "lawns" (
  "LawnId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "area" GEOMETRY(POLYGON, 4326) NOT NULL,
  "UserId" UUID NOT NULL,
  "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("UserId") REFERENCES "Users"("UserId") ON DELETE CASCADE
);