'use strict';

var _ = require('lodash');
var $ = require('./jquery.pagination');
require('github/Semantic-Org/Semantic-UI@1.11.6/dist/semantic');

$(document).ready(function () {

  if(application.index.pageCount > 1) {
    var visiblePageCount = 7;

    $('.pagination').pagination({
      pageCount: application.index.pageCount,
      currentPage: application.index.currentPage,
      visiblePageCount: visiblePageCount,
      onPageChange: function(n) {
        var path = '/index/';
        if(application.index.isCategory) {

          path = '/categoryView/' + pathId + '/';
        }

        location.href = path + n;
      }
    });
  }

  var $image = $('.image');
  $image.on('click', function() {
    var id = $(this).data('id');
    location.href = '/itemDetails/' + id;
  });

});
