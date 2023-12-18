const express = require('express')
const { router } = require('./router.js');
const { connection } = require('./database/connection.js');

const port = process.env.PORT || 4400;

const app = express();
app.use(express.json());
app.use(router);

app.listen(port, async () => {
  await connection.connect();
  console.log('Database connected');
  console.log('Server listen on port', port)
});
