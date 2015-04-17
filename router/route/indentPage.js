'use strict';

var express = require('express');
var router = express.Router();

var indentController = require('../../controller/indentController');

router.get('/', indentController.renderIndentPage);

module.exports = router;
