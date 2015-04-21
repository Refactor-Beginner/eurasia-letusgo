'use strict';

var _ = require('lodash');

var FormatUtil = require('../util/formatUtil');
var constants = require('../util/constants');

var Cart = require('../model/cart');
var Item = require('../model/item');
var CartItem = require('../model/cartItem');

function findCartById(cartId) {

  return Cart.findById(cartId)
    .populate('cartItems')
    .exec()
    .then(function(cart){
      return Item.populate(cart, 'cartItems.item');
    });
}

function createNewCartItem(res, id, number, cart){
  //CartItem.create({item:id, number: number})
  //  .exec()
  //  .then(function(cartItem){
  //    console.log(cartItem + '++++++++++');
  //
  //    cart.cartItems.push(cartItem._id);
  //    cart.save().exec();
  //  })
  //  .then(res.send({
  //    status: 200,
  //    data: '成功添加新商品到购物车！'
  //  }));
//console.log(CartItem.create({item:id, number: number}).exec());

  CartItem.create({item:id, number: number}, function(err, cartItem){
    cart.cartItems.push(cartItem._id);
    cart.save(function(){
      res.send({status: 200, data: '成功添加新商品到购物车！'});
    });
  });
}

function modifyExistedCartItem (res, result, number, id){

  number += result.number;
  CartItem.update({item: id}, {$set: {number: number}}, function(){
    res.send({status: 200, data: '修改数量成功！'});
  });
}

var getCart = function(req, res, next){

  var cartId = '551cc282a6b79c584b59bc0f';

    findCartById(cartId)
    .then(function(cart){
      _.forEach(cart.cartItems, function(cartItem) {
        cartItem.item.shortName = FormatUtil.parseString(cartItem.item.name, constants.NAME_LENGTH);
      });

      var total = cart.getTotal(cart.cartItems);
      res.render('cart', {cartItems: cart.cartItems, total: total});
    })
    .onReject(function(err){
      next(err);
    });
};

var addToCart = function(req, res, next){

  var cartId = '551cc282a6b79c584b59bc0f';
  var number = parseInt(req.body.number);
  var id = req.params.id;

  findCartById(cartId)
    .then(function(cart){

      var result = _.find(cart.cartItems, function(cartItem) {
        return cartItem.item._id.toString() === id;
      });

      if(result){
        modifyExistedCartItem (res, result, number, id);
      }else{
        createNewCartItem(res, id, number, cart);
      }
    })
    .onReject(function(err){
      next(err);
    });
};

var changeCartItem = function(req, res, next) {
  var cartItemId = req.params.id;
  var number = req.body.number;
  var price = req.body.price;
  var total = req.body.total;

  CartItem.findById(cartItemId)
    .exec()
    .then(function(cartItem){

      CartItem.update({_id: cartItemId}, {$set: {number: number}}).exec();
      return cartItem.number * price;
    })
    .then(function(currentTotal){

      var subtotal = price * number;
      total = total - currentTotal + subtotal;

      res.send({subtotal: subtotal.toFixed(2), total: total.toFixed(2)});
    })
    .onReject(function(err){
      next(err);
    });
};


var removeCartItem = function(req, res) {
  var cartItemId = req.params.cartItemId;
  var cartId = '551cc282a6b79c584b59bc0f';

  Cart.findById(cartId, function(err, cart) {
    if(err) {
      throw err;
    }
    cart.cartItems = _.remove(cart.cartItems, function(cartItem) {
      return cartItem.toString() !== cartItemId;
    });

    CartItem.remove({_id: cartItemId}, function() {

      cart.save(function(err, cart) {
        if(err) {
          throw err;
        }
        CartItem.find()
          .populate('item')
          .exec(function(err, cartItems) {

            res.send({cart: cart, total: cart.getTotal(cartItems)});
          });
      });
    });
  });

  //Cart.findById(cartId)
  //  .exec()
  //  .then(function(cart){
  //
  //    return _.remove(cart.cartItems, function(cartItem) {
  //      return cartItem.toString() !== cartItemId;
  //    });
  //  })
  //  .then(CartItem.remove({_id: cartItemId}))
  //  .then(Cart.save)
  //  .then(function(){
  //    return CartItem.find().populate('item').exec();
  //  })
  //  .then(function(cartItems){
  //    res.send({cart: cart, total: cart.getTotal(cartItems)});
  //  });
};

var getAmount = function(req, res) {
  var cartId = '551cc282a6b79c584b59bc0f';

  Cart.findById(cartId)
    .populate('cartItems')
    .exec(function(err, cart) {
      var count = _.reduce(cart.cartItems, function(count, cartItem) {
        return cartItem.number + count;
      }, 0);

      res.send({amount: count});
    });
};

var getInventory = function(req, res, next) {
  var id = req.params.id;

  CartItem.findById(id)
    .exec()
    .then(function(cartItem){
      return Item.findById(cartItem.item).exec();
    })
    .then(function(item){
      res.send({inventory: item.inventory});
    })
    .onReject(function(err){
      next(err);
    });
};

module.exports = {
  getCart: getCart,
  addToCart: addToCart,
  changeCartItem: changeCartItem,
  removeCartItem: removeCartItem,
  getAmount: getAmount,
  getInventory: getInventory
};
