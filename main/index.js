const express = require('express');
const lightServices = require('./services/lightServices.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const app = express();
const port = 8080;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/lights/mode/:command', function (req, res) {
  // console.log('req :', req);
  res.send(lightServices.setLightMode(req.params.command));
});
//
app.get('/lights/status', function (req, res) {
  // console.log('req :', req);
  res.send(lightServices.getLightStatus());
});
//
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, function() {
  console.log('Running on port:', port);
});
