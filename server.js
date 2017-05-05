const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use('/static', express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
})

// API (v1)
const apiRoutes = require('./backend/api/v1/');
app.use('/api/v1', apiRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Pokedex listening on ${process.env.PORT || 5000}`);
});

// Catch errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ status: 'error', error: err.code });
});
