require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocs = yaml.load('./swagger.yaml');
// Import mongo connection function
const connectMongoDB = require('./app/database/mongoConnection');

// Router
const employeeRouter = require('./app/routes/employeeRouter');
const customerRouter = require('./app/routes/customerRouter');
const userRouter = require('./app/routes/userRouter');
const errorHandler = require('./app/middleware/errorHandle');

const app = express();
app.use(express.json());

// Use router of employee
app.use('/', employeeRouter);
// router cusomer
app.use('/', customerRouter);
// user, for token
app.use('/user', userRouter);
// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// handle error
app.use(errorHandler);
// connect mongo
connectMongoDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
