We are going to Create our first API to trigger the Rainbow Function from SWAGGER

> Create the file:
```
./main/services/lightServices.js
```

---

> Convert the rainbow.js to a function that we can call


---

> Add Epic comment blocks by using:
http://patorjk.com/software/taag/#p=display&f=Small&t=myComment


---

> Modify the Swagger to point to our function and handle input

---

> Configure Express to forward the API call to the our function by modifying ./index.js
```
const lightServices = require('./services/lightServices.js');
//
app.get('/lights/mode/:command', (req, res) => {
  res.send(lightServices.setLightMode(req.params.command));
});
//
```

---

> Test with
```
yarn start
```

or from the Raspberry:
```
sudo node ./main/index.js
```
