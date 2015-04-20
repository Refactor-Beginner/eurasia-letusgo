'use strict';

var Item = require('../../model/item');
var CartItem = require('../../model/cartItem');
var Cart = require('../../model/cart');
var Category = require('../../model/category');
var Indent = require('../../model/indent');

var items = require('../../seed/test/items');
var cartItems = require('../../seed/test/cartItems');
var indents = require('../../seed/test/indents');
var categories = require('../../seed/test/categories');
var carts = require('../../seed/test/carts');

var reloadDatabase = function() {
  CartItem.remove({}).exec()
    .then(Cart.remove({}).exec())
    .then(Category.remove({}).exec())
    .then(Indent.remove({}).exec())
    .then(Item.remove({}).exec());

  Item.create(items);
  CartItem.create(cartItems);
  Cart.create(carts);
  Category.create(categories);
  Indent.create(indents);
};

module.exports = reloadDatabase;
