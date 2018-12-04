const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const lightServices = require('./services/lightServices.js');
const swaggerDocument = require('../swagger.json');

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//
app.get('/lights/mode/:command', (req, res) => {
  res.send(lightServices.setLightMode(req.params.command));
});
//
app.get('/lights/status', (req, res) => {
  res.send(lightServices.getLightStatus());
});
//
app.get('/lights/speed/:speed', (req, res) => {
  res.send(lightServices.setLightSpeed(req.params.speed));
});
//
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});
//
app.listen(port, () => {
  console.log('Running on port:', port);
});
