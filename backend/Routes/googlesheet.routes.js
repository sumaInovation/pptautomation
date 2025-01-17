const express = require('express');
const router = express.Router();
const machinedata=require('../controllers/machinedata.controller')
const todayData=require('../controllers/fetchTodayData.controllers')
router.post('/machine-data',machinedata)
router.get('/today-data',todayData)

module.exports = router;