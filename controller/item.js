'use strict';

var Item = require('../model/item');
var Category = require('../model/category');
var CartItem = require('../model/cartItem');

function getItemsByCartItemId(cartItems, callback) {

  var itemIds = [];
  cartItems.forEach(function(cartItem) {

    var cartItemModel = new CartItem();
    itemIds.push(cartItemModel.getItemId(cartItem));
  });

  Item.where('_id').in(itemIds).exec(function(err, items) {
    callback(items);
  });
}

var renderItemDetail = function(req, res, next){
  var id = req.params.id;

  Item.findById(id)
    .populate('category')
    .exec()
    .then(function(item){
      return Category.populate(item, 'category.parent');
    })
    .then(function(item) {

      var itemDetails = {item: item, category: item.category};
      res.render('itemDetails', {itemDetails: itemDetails});
    })
    .onReject(function(err){
      next(err);
    });
};

var getItems = function(req, res) {

  var cartItems = req.query.cartItems;

  getItemsByCartItemId(cartItems, function(items) {
    res.send(items);
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
  getItems: getItems,
  getItemById: getItemById,
  updateItem: updateItem
};
