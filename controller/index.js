'use strict';

var _ = require('lodash');

var Category = require('../model/category');
var Item = require('../model/item');

var FormatUtil = require('../util/formatUtil');
var constants = require('../util/constants');

function getCategories(categories){

  var mainCategories = Category.getMainCategories(categories);
  mainCategories = Category.getSubCategories(categories, mainCategories);

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

  var categoryList, itemList;
  var params = processParams(paramObject);
  var start = (params.pageNumber-1)*constants.PAGE_SIZE;

  Category.find().populate('parent').exec()
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

function getCurrentCategory( res, next, pageNumber, id){

  Category.findById(id).populate('parent').exec()
    .then(function(category){

      var currentCategory = category;
      currentCategory.isDisplay = true;

      return  {
        query: {category: id},
        currentCategory: currentCategory,
        pageNumber: pageNumber,
        isCategory: true,
        res: res,
        next: next
      };
    }).then(function(params){
      renderPage(params);
    });
}

var getIndexInfo = function(req, res, next) {

  var params = {res: res, next: next};

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
  var pageNumber = req.params.pageNumber || 1;

  getCurrentCategory(res, next, pageNumber, id);
};

module.exports = {

  getIndexInfo: getIndexInfo,
  getRecommendItemsByPageNumber: getRecommendItemsByPageNumber,
  getItemsByCategoryId: getItemsByCategoryId
};
