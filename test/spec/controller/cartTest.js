'use strict';

var cartController = require('../../../controller/cart');

describe('cart', function() {

  var resMock = {};
  var reqMock = {};

  beforeEach(function(done){

    resMock = {};
    reqMock = {};

    done();
  });

  afterEach(function() {
    reloadDatabase();
  });

  describe('getCart', function() {

    it('shoulde return cart', function(done) {

      resMock.render = function(view, object) {

        expect(view).to.equal('cart');
        expect(object).to.have.property('cartItems');
        expect(object).to.have.property('total');
        expect(object.total).to.equal(3334.50);

        done();
      };

      cartController.getCart(reqMock, resMock);
    });
  });

  describe('addToCart', function() {


    it('shoulde return modify the number when cartItem has existed', function(done) {

      reqMock.body = {number: 6};
      reqMock.params = {id: '5523cea79294d58a8e06c3bf'};

      resMock.send = function(info){

        expect(info).to.equal('修改数量成功！');
        done();
      };

      cartController.addToCart(reqMock, resMock);
    });

    it('shoulde add a new cartItem when cartItem has not existed', function(done){

      reqMock.body = {number: 6};
      reqMock.params = {id: '5523cea79294d58a8e06c3c9'};

      resMock.send = function (info){

        expect(info).to.equal('成功添加新商品到购物车！');
        done();
      };

      cartController.addToCart(reqMock, resMock);
    });
  });

  describe('changeCartItem controller', function(){
    it('')

  });
});

