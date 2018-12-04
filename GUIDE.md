In this step we are going to setup our project to host the [OpenApi](https://swagger.io/docs/specification/about/) documentation through [SWAGGER UI](https://swagger.io/tools/swagger-ui/).

Download an OpenApi example from here: https://editor.swagger.io/
```
File > Convert and save as JSON
Copy file to project root folder > swagger.json
```

Import the dependency into ./main/index.js
```
const swaggerDocument = require('../swagger.json');
```

Configure Express to serve the api documentation through the Swagger UI, by adding the following line to ./main/index.js
```
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

RUN the project with:
```
yarn start
```

Open the SWAGGER UI on:
```
http://localhost:8080/api-docs/
```
