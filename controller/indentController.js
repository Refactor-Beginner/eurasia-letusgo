'use strict';

var constants = require('../util/constants');

var Indent = require('../model/indent');
var Item = require('../model/item');
var FormatUtil = require('../util/formatUtil.js');

function getTotal(indent, query, done) {
  Item.populate(indent, query, function(err) {
    done(err, indent.getTotal(indent.cartItems));
  });
}

function getIndentById(done) {
  Indent.findById('551fd16975cd55ed0cfa5503')

    .populate('cartItems')
    .exec(function(err, indent) {

      done(err, indent);
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

var getIndent = function(req, res, next) {

  getIndentById(function(err, indent) {
    getTotal(indent, 'cartItems.item', function(err, total) {
      err && next(err);
      res.send({indent: indent, total: total});
    });
  });
};

var renderIndentPage = function(req, res, next) {

  getIndentById(function(err, indent) {

    getTotal(indent, 'cartItems.item', function(err, total) {
      err && next(err);

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


//var renderIndentPage = function(req, res){
//
//  //var promise = new Promise();
//  //promise.then(function(){
//  //  return  Indent.findById('551fd16975cd55ed0cfa5503')
//  //    .populate('cartItems')
//  //    .exec();
//  //})
//  Indent.find('551fd16975cd55ed0cfa5503')
//    .then(function(){
//      return  Indent.findById('551fd16975cd55ed0cfa5503')
//          .populate('cartItems')
//          .exec();
//    })
//    .then(function(indent){
//      Item.populate(indent, 'cartItems.item').exec();
//    })
//    .then(function(indent){
//      var total = indent.getTotal(indent.cartItems);
//
//      indent.cartItems.forEach(function(cartItem) {
//        cartItem.item.shortName = FormatUtil.parseString(cartItem.item.name, constants.NAME_LENGTH);
//      });
//
//      var shortedCartItemName = getShortedCartItemName(indent.cartItems);
//
//      res.render('indent', {
//        cartItems: indent.cartItems,
//        total: total,
//        indent: indent,
//        shortedCartItemName: shortedCartItemName
//      });
//    });
//};

module.exports = {
  getIndent: getIndent,
  renderIndentPage: renderIndentPage
};
