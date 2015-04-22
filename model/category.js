'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  parent: {
    type: Schema.ObjectId,
    ref: 'Category'
  }
});

function  getSubCategories(categories, mainCategories){

  _.forEach(categories, function(category) {

    if(category.parent) {

      _.forEach(mainCategories, function(mainCategory) {

        if(category.parent.name === mainCategory.name) {
          mainCategory.subCategories.push(category);
        }
      });
    }
  });
  return mainCategories;
}

CategorySchema.statics.getCategories = function(categories){

  var mainCategories =  _.filter(categories, function(category) {

    category.subCategories = [];
    if(!category.parent){
      return category;
    }
  });

  mainCategories = getSubCategories(categories, mainCategories);

  return mainCategories;
};

module.exports = mongoose.model('Category', CategorySchema);
