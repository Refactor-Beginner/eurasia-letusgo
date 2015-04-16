'use strict';

var _ = require('lodash');

var Category = require('../model/category');
var Item = require('../model/item');

var FormatUtil = require('../util/formatUtil');

var PAGE_SIZE = 8;
var NAME_LENGTH = 16;

function initItems(query, start, pageSize, callback) {

  Item.find(query).exec(function(err, items) {

    items.forEach(function(item) {

      item.shortName = FormatUtil.parseString(item.name, NAME_LENGTH);
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

function initCategories(initItemsObject, renderObject) {

  initItems(initItemsObject.query, initItemsObject.start, initItemsObject.pageSize, function(items, pageCount) {

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
            res: renderObject.res,
            mainCategories: mainCategories,
            currentCategory: renderObject.currentCategory,
            items: items,
            pageCount: pageCount,
            pageNumber: renderObject.pageNumber,
            isCategory: renderObject.isCategory
          });
      });
  });
}

var getIndexInfo = function(req, res) {
  var currentCategory = {isDisplay: false, name: '', parent: {name: ''}};

  var initItemsObject = {
    query: {isRecommend: true},
    start: 0,
    pageSize: PAGE_SIZE
  };

  var renderObject = {
    res: res,
    currentCategory: currentCategory,
    pageNumber: 1,
    isCategory: false
  };
  initCategories(initItemsObject, renderObject);
};

var getRecommendItemsByPageNumber = function(req, res) {

  var pageNumber = req.params.pageNumber;
  var start = (pageNumber - 1) * PAGE_SIZE;
  var currentCategory = {isDisplay: false, name: '', parent: {name: ''}};

  var initItemsObject = {
    query: {isRecommend: true},
    start: start,
    pageSize: PAGE_SIZE
  };
  var renderObject = {
    res: res,
    currentCategory: currentCategory,
    pageNumber: pageNumber,
    isCategory: false
  };
  initCategories(initItemsObject, renderObject);
};

var getItemsByCategoryId = function(req, res) {

  var id = req.params.id;
  var currentCategory;

  Category.findById(id)
    .populate('parent')
    .exec(function(err, category) {

      currentCategory = category;
      currentCategory.isDisplay = true;

      var initItemsObject = {
        query: {category: id},
        start: 0,
        pageSize: PAGE_SIZE
      };
      var renderObject = {
        res: res,
        currentCategory: currentCategory,
        pageNumber: 1,
        isCategory: true
      };
      initCategories(initItemsObject, renderObject);
    });
};

var getItemsByCategoryIdAndPageNumber = function(req, res) {

  var id = req.params.id;

  var pageNumber = req.params.pageNumber;
  var start = (pageNumber - 1) * PAGE_SIZE;

  var currentCategory;
  Category.findById(id)
    .populate('parent')
    .exec(function(err, category) {

      currentCategory = category;
      currentCategory.isDisplay = true;

      var initItemsObject = {
        query: {category: id},
        start: start,
        pageSize: PAGE_SIZE
      };
      var renderObject = {
        res: res,
        currentCategory: currentCategory,
        pageNumber: pageNumber,
        isCategory: true
      };
      initCategories(initItemsObject, renderObject);
    });
};

module.exports = {

  getIndexInfo: getIndexInfo,
  getRecommendItemsByPageNumber: getRecommendItemsByPageNumber,
  getItemsByCategoryId: getItemsByCategoryId,
  getItemsByCategoryIdAndPageNumber: getItemsByCategoryIdAndPageNumber
};
