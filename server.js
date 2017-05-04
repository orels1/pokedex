const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use('/static', express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Pokedex listening on ${process.env.PORT || 5000}`);
});
