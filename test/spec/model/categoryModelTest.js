'use strict';

var Category = require('../../../model/category');

describe('Category model', function(){

  var categories;

  beforeEach(function(done){

    Category.find().
      populate('parent')
      .exec(function (err, allCategories) {

        categories = allCategories;
        done();
      });
  });

  afterEach(function(){
    reloadDatabase();
  });

  it('getCategories method should get all categories', function(){
    expect(Category.getCategories(categories).length).to.equal(10);
    expect(Category.getCategories(categories)[0].length).to.equal(5);
  });
});
