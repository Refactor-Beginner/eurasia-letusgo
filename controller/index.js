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

function renderIndexPage(res, renderObject) {

  res.render('index', {
    mainCategories: renderObject.mainCategories,
    currentCategory: renderObject.currentCategory,
    items: renderObject.items,
    pageCount: renderObject.pageCount,
    currentPage: renderObject.pageNumber,
    isCategory: renderObject.isCategory
  });
}

//function initCategories(res, query, start, pageSize, currentCategory, pageNumber, isCategory) {
function initCategories(res, initItemsObject, currentCategory, pageNumber, isCategory) {

  initItems(initItemsObject.query, initItemsObject.start, initItemsObject.pageSize, function(items, pageCount) {

    Category.find()
      .populate('parent')
      .exec(function(err, categories) {

        var mainCategories = _.filter(categories, function(category) {

          category.subCategories = [];
          return category.parent === null;
        });
        mainCategories = getSubCategories(categories, mainCategories);

        renderIndexPage(res,
          {
            mainCategories: mainCategories,
            currentCategory: currentCategory,
            items: items,
            pageCount: pageCount,
            pageNumber: pageNumber,
            isCategory: isCategory
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
  initCategories(res, initItemsObject, currentCategory, 1, false);
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
  initCategories(res, initItemsObject, currentCategory, pageNumber, false);
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
      initCategories(res, initItemsObject, currentCategory, 1, true);
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
      initCategories(res, initItemsObject, currentCategory, pageNumber, true);
    });
};

module.exports = {

  getIndexInfo: getIndexInfo,
  getRecommendItemsByPageNumber: getRecommendItemsByPageNumber,
  getItemsByCategoryId: getItemsByCategoryId,
  getItemsByCategoryIdAndPageNumber: getItemsByCategoryIdAndPageNumber
};
