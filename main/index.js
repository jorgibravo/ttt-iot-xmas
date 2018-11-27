const express = require('express');
const lightServices = require('./services/lightServices.js');
const app = express();
const port = 8080;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/lights/:mode', function (req, res) {
  console.log('req :', req);
  res.send(lightServices.changeLightShow(req.params.mode));
});

app.listen(port, function() {
  console.log('Running on port:', port);
});
