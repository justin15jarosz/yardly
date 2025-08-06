-- This script is intended to be run with the `psql` command-line tool.
-- It creates the 'yardly' database if it doesn't exist, then connects to it.

-- Create the database if it doesn't exist
-- \gexec is a psql meta-command that executes the query result
SELECT 'CREATE DATABASE yardly'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'yardly')\gexec

-- Connect to the 'yardly' database.
-- This is a psql meta-command.
\c yardly

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the lawns table
CREATE TABLE IF NOT EXISTS lawns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  area GEOMETRY(POLYGON, 4326) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert some dummy data
INSERT INTO lawns (name, area) VALUES
('Front Yard', ST_GeomFromText('POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))', 4326)),
('Back Yard', ST_GeomFromText('POLYGON((20 20, 30 20, 30 30, 20 30, 20 20))', 4326)),
('Side Garden', ST_GeomFromText('POLYGON((5 15, 15 15, 15 25, 5 25, 5 15))', 4326));
