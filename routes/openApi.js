const express = require('express');
const openApiRouter = express.Router();
const {  getGrokApi,  summarizeText, generateCode, generateImage } = require('../controllers/openApiController');
openApiRouter.post('/openapi',getGrokApi);
openApiRouter.post('/summary',summarizeText)
openApiRouter.post('/code',generateCode)
openApiRouter.post('/image',generateImage)

module.exports = openApiRouter;
