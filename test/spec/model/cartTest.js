'use strict';

var Cart = require('../../../model/cart');
var CartItem = require('../../../model/cartItem');

describe('cart model', function(){

  var cart = new Cart();
  var cartItems;

  beforeEach(function(done){

    CartItem.findById('551cc20e47a654d14a280e9b')
      .populate('item')
      .exec(function(err, cartItem){

      cartItems = [cartItem];
      done();
    });
  });

  afterEach(function(){

    reloadDatabase();
  });

  it('should get total of cartItems', function(){
    expect(cart.getTotal(cartItems)).to.equal('617');
  });
});
