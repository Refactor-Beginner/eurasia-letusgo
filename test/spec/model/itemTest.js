'use strict';

var Item = require('../../../model/item');

describe('item', function() {

  var newItem = new Item();

  beforeEach(function(done) {

    Item.findById('5523cea79294d58a8e06c3bf')
      .exec(function(err, item) {
        newItem = item;
        done();
      });
  });

  it('should return right item id', function() {
    var id = newItem.getId(newItem).toString();
    expect(id).to.equal('5523cea79294d58a8e06c3bf');
  });

});
