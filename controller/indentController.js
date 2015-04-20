'use strict';

var constants = require('../util/constants');

var Indent = require('../model/indent');
var Item = require('../model/item');
var FormatUtil = require('../util/formatUtil.js');

function getIndentById() {

  return Indent.findById('551fd16975cd55ed0cfa5503')
            .populate('cartItems')
            .exec()
            .then(function(indent){
              return Item.populate(indent, 'cartItems.item');
            });
}

function getShortedCartItems(cartItems) {

  var shortedCartItemName = '';

  cartItems.forEach(function(cartItem) {

    if(cartItem.number > cartItem.item.inventory) {
      shortedCartItemName += cartItem.item.name + '、';
    }
  });
  return shortedCartItemName.substring(0, shortedCartItemName.length - 1);
}

var getIndent = function(req, res, next){

  getIndentById()
    .then(function(indent){
      var total = indent.getTotal(indent.cartItems);
      res.send({indent: indent, total: total});
    })
    .onReject(function(err){
      next(err);
    });
};

var renderIndentPage = function(req, res, next){

  getIndentById()
    .then(function(indent){

      var total = indent.getTotal(indent.cartItems);
      var shortedCartItems = getShortedCartItems(indent.cartItems);

      indent.cartItems.forEach(function(cartItem) {
        cartItem.item.shortName = FormatUtil.parseString(cartItem.item.name, constants.NAME_LENGTH);
      });

      res.render('indent', {
        cartItems: indent.cartItems,
        total: total,
        indent: indent,
        shortedCartItemName: shortedCartItems
      });
    })
    .onReject(function(err){
      next(err);
    });
};

module.exports = {
  getIndent: getIndent,
  renderIndentPage: renderIndentPage
};
