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

function renderIndexPage(renderObject) {

  renderObject.res.render('index', {
    mainCategories: renderObject.mainCategories,
    currentCategory: renderObject.currentCategory,
    items: renderObject.items,
    pageCount: renderObject.pageCount,
    currentPage: renderObject.pageNumber,
    isCategory: renderObject.isCategory
  });
}

function initCategories(paramObject) {

  var currentItems;
  var pageCount;

  Item.find(paramObject.query)
    .exec()
    .then(function(items){

      items.forEach(function(item) {

        item.shortName = FormatUtil.parseString(item.name, constants.NAME_LENGTH);
      });

      currentItems = _.take(_.drop(items, paramObject.start), paramObject.pageSize);
      pageCount = Math.ceil(items.length / paramObject.pageSize);

      return Category.find().populate('parent').exec();
    })
    .then(function(categories){

      var mainCategories = _.filter(categories, function(category) {

        category.subCategories = [];
        return category.parent === null;
      });
      mainCategories = getSubCategories(categories, mainCategories);

      renderIndexPage(
        {
          res: paramObject.res,
          mainCategories: mainCategories,
          currentCategory: paramObject.currentCategory,
          items: currentItems,
          pageCount: pageCount,
          pageNumber: paramObject.pageNumber,
          isCategory: paramObject.isCategory
        });
    })
    .onReject(function(err){
      paramObject.next(err);
    });
}

function  initCategoriesByObject (object){

  var defaultObject = {
    query: {isRecommend: true},
    start: 0,
    pageNumber: 1,
    isCategory: false
  };

  var params = _.assign(defaultObject, object);

  initCategories(params);
}
var getIndexInfo = function(req, res, next) {
  var currentCategory = {isDisplay: false, name: '', parent: {name: ''}};

  var object = {
    pageSize: constants.PAGE_SIZE,
    res: res,
    next: next,
    currentCategory: currentCategory
  };
  initCategoriesByObject(object);
};

var getRecommendItemsByPageNumber = function(req, res, next) {

  var pageNumber = req.params.pageNumber;
  var start = (pageNumber - 1) * constants.PAGE_SIZE;
  var currentCategory = {isDisplay: false, name: '', parent: {name: ''}};

  var object = {
    pageSize:  constants.PAGE_SIZE,
    start: start,
    res: res,
    next: next,
    pageNumber: pageNumber,
    currentCategory: currentCategory
  };
  initCategoriesByObject(object);
};

var getItemsByCategoryId = function(req, res, next) {

  var id = req.params.id;
  var currentCategory;

  Category.findById(id)
    .populate('parent')
    .exec(function(err, category) {

      currentCategory = category;
      currentCategory.isDisplay = true;

      var paramObject = {
        query: {category: id},
        pageSize: constants.PAGE_SIZE,
        res: res,
        next: next,
        currentCategory: currentCategory,
        isCategory: true
      };

      initCategoriesByObject(paramObject);
    });
};

var getItemsByCategoryIdAndPageNumber = function(req, res, next) {

  var id = req.params.id;

  var pageNumber = req.params.pageNumber;
  var start = (pageNumber - 1) * constants.PAGE_SIZE;

  var currentCategory;
  Category.findById(id)
    .populate('parent')
    .exec(function(err, category) {

      currentCategory = category;
      currentCategory.isDisplay = true;

      var paramObject = {
        query: {category: id},
        start: start,
        pageSize: constants.PAGE_SIZE,
        currentCategory: currentCategory,
        pageNumber: pageNumber,
        isCategory: true,
        res: res,
        next: next
      };
      initCategoriesByObject(paramObject);
    });
};

module.exports = {

  getIndexInfo: getIndexInfo,
  getRecommendItemsByPageNumber: getRecommendItemsByPageNumber,
  getItemsByCategoryId: getItemsByCategoryId,
  getItemsByCategoryIdAndPageNumber: getItemsByCategoryIdAndPageNumber
};
