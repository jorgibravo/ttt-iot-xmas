const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
//
app.use(express.static(path.join(__dirname, '../build')));
//
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});
//
app.listen(port, () => {
  console.log('Running on port:', port);
});
