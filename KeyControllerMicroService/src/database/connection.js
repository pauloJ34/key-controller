const { Client } = require('pg');

const connection = new Client({
  connectionString: process.env.DB_CONNECTION
});

module.exports = { connection }