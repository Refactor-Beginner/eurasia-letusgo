'use strict';

var Indent = require('../../../model/indent');
var Item = require('../../../model/item');

describe('indentModel', function() {

  var indent = new Indent();
  var cartItems;

  beforeEach(function(done) {

    Indent.findById('551fd16975cd55ed0cfa5503')
      .populate('cartItems')
      .exec(function(err, newIndent) {

        indent = newIndent;
        Item.populate(newIndent, 'cartItems.item', function() {
          cartItems = newIndent.cartItems;
          done();
        });
      });
  });

  it('should get right total', function() {
        var total = indent.getTotal(cartItems);
    expect(total).to.equal('3334.50');
  });
});
