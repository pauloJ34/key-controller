const { Router } = require('express')
const { GenerateReportController } = require('./controllers/GenerateReportController.js')

const router = Router();

const generateReportController = new GenerateReportController();

router.post('/report', generateReportController.handle);

module.exports = { router };