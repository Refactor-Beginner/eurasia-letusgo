'use strict';

var Indent = require('../model/indent');
var Item = require('../model/item');
var FormatUtil = require('../util/formatUtil.js');

var NAME_LENGTH = 16;

function getShortedCartItemName(cartItems) {

  var shortedCartItemName = '';

  cartItems.forEach(function(cartItem) {
    if(cartItem.number > cartItem.item.inventory) {
      shortedCartItemName += cartItem.item.name + '、';
    }
  });

  return shortedCartItemName.substring(0, shortedCartItemName.length - 1);
}

var getIndent = function(req, res) {

  Indent.findById('551fd16975cd55ed0cfa5503')
    .populate('cartItems')
    .exec(function(err, indent) {

      Item.populate(indent, 'cartItems.item', function(err) {

        if(err) {
          throw err;
        }

        var total = indent.getTotal(indent.cartItems);
        res.send({indent: indent, total: total});
      });
    });
};

var renderIndentPage = function(req, res) {

  Indent.findById('551fd16975cd55ed0cfa5503')
    .populate('cartItems')
    .exec(function(err, indent) {

      Item.populate(indent, 'cartItems.item', function(err) {
        if(err) {
          throw err;
        }

        indent.cartItems.forEach(function(cartItem) {
          cartItem.item.shortName = FormatUtil.parseString(cartItem.item.name, NAME_LENGTH);
        });

        var total = indent.getTotal(indent.cartItems);
        var shortedCartItemName = getShortedCartItemName(indent.cartItems);

        res.render('indent', {
          cartItems: indent.cartItems,
          total: total,
          indent: indent,
          shortedCartItemName: shortedCartItemName
        });
      });
    });

};


module.exports = {
  getIndent: getIndent,
  renderIndentPage: renderIndentPage
};
