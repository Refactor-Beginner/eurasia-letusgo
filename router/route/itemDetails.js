'use strict';

var express = require('express');
var router = express.Router();

var itemController = require('../../controller/item.js');

router.get('/:id', itemController.renderItemDetail);

module.exports = router;
