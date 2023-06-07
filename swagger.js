const swaggerJsDoc = require('swagger-jsdoc');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'A simple API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./app/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);
const swaggerDocs = yaml.stringify(swaggerSpec, 10);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
