'use strict';

var _ = require('lodash');

var Category = require('../model/category');
var Item = require('../model/item');

var FormatUtil = require('../util/formatUtil');
var constants = require('../util/constants');

function initItems(query, start, pageSize, callback) {

  Item.find(query).exec(function(err, items) {

    items.forEach(function(item) {

      item.shortName = FormatUtil.parseString(item.name, constants.NAME_LENGTH);
    });

    var newItems = _.take(_.drop(items, start), pageSize);
    var pageCount = Math.ceil(items.length / pageSize);

    callback(newItems, pageCount);
  });
}

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

  initItems(paramObject.query, paramObject.start, paramObject.pageSize, function(items, pageCount) {

    Category.find()
      .populate('parent')
      .exec(function(err, categories) {

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
            items: items,
            pageCount: pageCount,
            pageNumber: paramObject.pageNumber,
            isCategory: paramObject.isCategory
          });
      });
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
var getIndexInfo = function(req, res) {
  var currentCategory = {isDisplay: false, name: '', parent: {name: ''}};

  var object = {
    pageSize: constants.PAGE_SIZE,
    res: res,
    currentCategory: currentCategory
  };
  initCategoriesByObject(object);
};

var getRecommendItemsByPageNumber = function(req, res) {

  var pageNumber = req.params.pageNumber;
  var start = (pageNumber - 1) * constants.PAGE_SIZE;
  var currentCategory = {isDisplay: false, name: '', parent: {name: ''}};

  var object = {
    pageSize:  constants.PAGE_SIZE,
    start: start,
    res: res,
    pageNumber: pageNumber,
    currentCategory: currentCategory
  };
  initCategoriesByObject(object);
};

var getItemsByCategoryId = function(req, res) {

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
        currentCategory: currentCategory,
        isCategory: true
      };

      initCategoriesByObject(paramObject);
    });
};

var getItemsByCategoryIdAndPageNumber = function(req, res) {

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
        res: res
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
