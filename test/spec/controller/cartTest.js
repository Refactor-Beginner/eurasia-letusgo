'use strict';

var cartController = require('../../../controller/cart');

describe('cart', function() {

  var resMock;
  var reqMock;

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
        expect(object.cartItems[2].item.shortName).to.equal('2015欧美大牌春装...');

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

        expect(info.data).to.equal('修改数量成功！');
        expect(info.status).to.equal(200);

        done();
      };

      cartController.addToCart(reqMock, resMock);
    });

    it('shoulde add a new cartItem when cartItem has not existed', function(done){

      reqMock.body = {number: 6};
      reqMock.params = {id: '5523cea79294d58a8e06c3c9'};

      resMock.send = function (info){

        expect(info.data).to.equal('成功添加新商品到购物车！');
        expect(info.status).to.equal(200);
        done();
      };

      cartController.addToCart(reqMock, resMock);
    });
  });

  describe('changeCartItem controller', function(){

    it('should get subtotal', function(done){

      reqMock.params = {id: '551cc20e47a654d14a280e9c'};
      reqMock.body = {
        price: 109,
        number: 4,
        total: 3334.50
      };

      resMock.send = function (object){

        expect(object.subtotal).to.equal('436.00');
        expect(object.total).to.equal('3552.50');

        done();
      };

      cartController.changeCartItem(reqMock, resMock);
    });
  });

  describe('removeCartItem controller', function(){

    it('should remove the cartItem from cart', function(done){

      reqMock.params = {cartItemId: '551cc20e47a654d14a280e9b'};
      resMock.send = function (object){

        expect(object.cart.cartItems.length).to.equal(3);
        expect(object.total).to.equal(3214.5);

        done();
      };

      cartController.removeCartItem(reqMock, resMock);
    });
  });

  describe('getAmount controller', function(){

    it('should get amout of cart', function(done){

      resMock.send = function (object){

        expect(object.amount).to.equal(31);
        done();
      };

      cartController.getAmount(reqMock, resMock);
    });
  });

  describe('getInventory controller', function(){

    it('should get inventory of specific cartItem', function(done){

      reqMock.params = {id: '551cc20e47a654d14a280e9d'};
      resMock.send = function(object){

        expect(object.inventory).to.equal(100);
        done();
      };

      cartController.getInventory(reqMock, resMock);
    });
  });
});

