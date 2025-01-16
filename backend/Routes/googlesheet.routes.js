const express = require('express');
const router = express.Router();
const machinedata=require('../controllers/machinedata.controller')

router.post('/machine-data',machinedata)


module.exports = router;