'use strict';

var _ = require('lodash');

var Category = require('../model/category');
var Item = require('../model/item');

var FormatUtil = require('../util/formatUtil');
var constants = require('../util/constants');

function getSubCategories(categories, mainCategories) {

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

function getCategories(categories){

  var mainCategories = _.filter(categories, function(category) {

    category.subCategories = [];
    if(!category.parent){
      return category;
    }
  });

  mainCategories = getSubCategories(categories, mainCategories);

  return mainCategories;
}

function processItemName(items){

  items.forEach(function(item) {
    item.shortName = FormatUtil.parseString(item.name, constants.NAME_LENGTH);
  });

  return items;
}

function processParams(paramObject){

  var defaultObject = {
    query: {isRecommend: true},
    pageNumber: 1,
    isCategory: false,
    currentCategory: {isDisplay: false, name: '', parent: {name: ''}}
  };

  return  _.assign(defaultObject, paramObject);
}

function renderPage(paramObject){

  var categoryList;
  var itemList;
  var params = processParams(paramObject);
  var start = (params.pageNumber-1)*constants.PAGE_SIZE;

  Category.find()
    .populate('parent')
    .exec()
    .then(function(categories) {

      categoryList = getCategories(categories);
    }).then(function() {
      return Item.find(params.query).skip(start).limit(constants.PAGE_SIZE).exec();
    }).then(function(items) {

      itemList = processItemName(items);
      return Item.count(params.query).exec();
    }).then(function(count) {

      params.res.render('index', {
        mainCategories: categoryList,
        currentCategory: params.currentCategory,
        items: itemList,
        pageCount: Math.ceil(count/constants.PAGE_SIZE),
        currentPage: params.pageNumber,
        isCategory: params.isCategory
      });
    }).onReject(function(err){
      params.next(err);
    });
}

var getIndexInfo = function(req, res, next) {

  var params = {
    res: res,
    next: next
  };

  renderPage(params);
};

var getRecommendItemsByPageNumber = function(req, res, next) {

  var pageNumber = req.params.pageNumber;

  var params = {
    res: res,
    next: next,
    pageNumber: pageNumber
  };
  renderPage(params);
};

var getItemsByCategoryId = function(req, res, next) {

  var id = req.params.id;
  var currentCategory;

  Category.findById(id)
    .populate('parent')
    .exec(function(err, category) {

      currentCategory = category;
      currentCategory.isDisplay = true;

      var params = {
        query: {category: id},
        res: res,
        next: next,
        currentCategory: currentCategory,
        isCategory: true
      };

      renderPage(params);
    });
};

var getItemsByCategoryIdAndPageNumber = function(req, res, next) {

  var id = req.params.id;
  var pageNumber = req.params.pageNumber;

  var currentCategory;
  Category.findById(id)
    .populate('parent')
    .exec(function(err, category) {

      currentCategory = category;
      currentCategory.isDisplay = true;

      var params = {
        query: {category: id},
        currentCategory: currentCategory,
        pageNumber: pageNumber,
        isCategory: true,
        res: res,
        next: next
      };

      renderPage(params);
    });
};

module.exports = {

  getIndexInfo: getIndexInfo,
  getRecommendItemsByPageNumber: getRecommendItemsByPageNumber,
  getItemsByCategoryId: getItemsByCategoryId,
  getItemsByCategoryIdAndPageNumber: getItemsByCategoryIdAndPageNumber
};
