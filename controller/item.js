'use strict';

var Item = require('../model/item');
var Category = require('../model/category');

var renderItemDetail = function(req, res, next){
  var id = req.params.id;

  Item.findById(id)
    .populate('category')
    .exec()
    .then(function(item){

      return Category.populate(item, 'category.parent');
    })
    .then(function(item) {

      var itemDetails = {
        item: item,
        category: item.category
      };

      res.render('itemDetails', {
        itemDetails: itemDetails
      });
    })
    .onReject(function(err){
      next(err);
    });
};

var getItemById = function(req, res) {

  var id = req.params.id;

  Item.findById(id, function(err, item) {

    res.send(item);
  });
};

var updateItem = function(req, res) {
  var id = req.params.id;

  var inventory = req.body.inventory;

  Item.update({_id: id}, {$set: {inventory: inventory}}, function() {
    res.send('inventory decrease successful');
  });
};

module.exports = {
  renderItemDetail: renderItemDetail,
  getItemById: getItemById,
  updateItem: updateItem
};
