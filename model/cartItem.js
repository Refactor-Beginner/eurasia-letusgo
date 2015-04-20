'use strict';

var mongoose = require('mongoose');
var Item = require('./item');

var Schema = mongoose.Schema;

var CartItemSchema = new Schema({
  item: {type: Schema.ObjectId, ref: 'Item'},
  number: Number
});

CartItemSchema.methods.getSubtotal = function() {

  var subtotal = this.item.price * this.number;

  return subtotal.toFixed(2);
};

CartItemSchema.methods.getItemId = function(cartItem) {
  return (cartItem.item.getId());
};

module.exports = mongoose.model('CartItem', CartItemSchema);
