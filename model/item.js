'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


function formatPrice(num) {
  return num.toFixed(2);
}

var ItemSchema = new Schema({
  name: String,
  unit: String,
  image: String,
  description: String,
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  specification: String,
  price: {type: Number, get: formatPrice},
  inventory: Number,
  isRecommend: Boolean
});

ItemSchema.methods.getId = function(item) {
  return item._id;
};

module.exports = mongoose.model('Item', ItemSchema);
