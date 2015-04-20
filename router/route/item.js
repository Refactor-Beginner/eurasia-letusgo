'use strict';

var express = require('express');
var router = express.Router();

var itemController = require('../../controller/item.js');

router.get('/:id', itemController.getItemById);
router.post('/:id', itemController.updateItem);

module.exports = router;
