require('dotenv').config();

module.exports = {
  migrationFolder: 'migrations',
  direction: 'up',
  logFileName: 'migrations.log',
  databaseUrl: process.env.DATABASE_URL,
};