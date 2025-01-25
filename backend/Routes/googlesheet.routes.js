const express = require('express');
const router = express.Router();
const machinedata=require('../controllers/machinedata.controller')
const todayData=require('../controllers/fetchTodayData.controllers')
const ThisMonthProduction=require('../controllers/ThisMonthProduction.controllers')
router.post('/machine-data',machinedata)
router.get('/today-data',todayData);
router.get('/thismonth-production',ThisMonthProduction)

module.exports = router;