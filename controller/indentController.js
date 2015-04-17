'use strict';

var constants = require('../util/formatUtil');

var Indent = require('../model/indent');
var Item = require('../model/item');
var FormatUtil = require('../util/formatUtil.js');

//var NAME_LENGTH = 16;

function throwError(err) {
  if(err) {
    throw err;
  }
}

function getTotal(indent, query, done) {
  Item.populate(indent, query, function(err) {

    throwError(err);
    done(indent.getTotal(indent.cartItems));
  });
}

function getIndentById(done) {
  Indent.findById('551fd16975cd55ed0cfa5503')
    .populate('cartItems')
    .exec(function(err, indent) {

      throwError(err);
      done(indent);
    });
}

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

  getIndentById(function(indent) {

    getTotal(indent, 'cartItems.item', function(total) {
      res.send({indent: indent, total: total});
    });
  });
};

var renderIndentPage = function(req, res) {

  getIndentById(function(indent) {

    getTotal(indent, 'cartItems.item', function(total) {

      indent.cartItems.forEach(function(cartItem) {
        cartItem.item.shortName = FormatUtil.parseString(cartItem.item.name, constants.NAME_LENGTH);
      });

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
