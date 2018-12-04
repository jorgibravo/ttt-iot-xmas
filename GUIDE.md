In this step we are going to prepare the project folders and install dependencies.
Let's start with creating a [new react app](https://github.com/facebook/create-react-app):

```
yarn create react-app ttt-xmas-iot
```

Let's Add the scripts to our package.json to use hot reloading for Node js scripts and serve the built version of the react pages
```
"start": "babel-watch --watch node ./main/index.js",
"build": "react-scripts build"
```

Then we are going to use Express, to serve the react page:
```
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
```
