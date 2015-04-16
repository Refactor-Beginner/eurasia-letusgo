'use strict';

var CartItem = require('../../../model/cartItem');

describe('cartItem model', function(){

  var cartItem;
  beforeEach(function(done){

    CartItem.findById('551cc20e47a654d14a280e9c')
      .populate('item')
      .exec(function(err, currentCartItem){

        cartItem = currentCartItem;
        done();
      });
  });

  afterEach(function(){

    reloadDatabase();
  });

  it('should get the subtotal of the cartItem', function(){

    expect(cartItem.getSubtotal()).to.equal('218.00');
  });

  it('should get the itemId of the cartItem', function(){

    expect(cartItem.getItemId(cartItem).toString()).to.equal('5523cea79294d58a8e06c3c0');
  });
});
