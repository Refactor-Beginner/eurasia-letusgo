'use strict';

var itemController = require('../../../controller/item');

describe('GET /', function() {

  var resMock = {};
  var reqMock = {};

  afterEach(function() {
    reloadDatabase();
  });

  it('it should return itemDetails', function(done) {

    reqMock.params = {id: '5523cea79294d58a8e06c3bf'};

    resMock.render = function(view, object) {
      expect(view).is.to.equal('itemDetails');
      expect(object).to.have.property('itemDetails');
      expect(object.itemDetails.item.name).to.equal('水溶C100功能饮料');

      done();
    };

    itemController.renderItemDetail(reqMock, resMock);
  });

  it('it should get correct item by id', function(done) {

    reqMock.params = {id: '5523cea79294d58a8e06c3bf'};

    resMock.send = function(object) {
      expect(object).to.have.property('name');
      expect(object).to.have.property('price');
      expect(object.name).to.equal('水溶C100功能饮料');
      expect(object.specification).to.equal('100ml');

      done();
    };
    itemController.getItemById(reqMock, resMock);
  });

  it('should update item', function(done) {

    reqMock.params = {id: '5523cea79294d58a8e06c3bf'};
    reqMock.body = {inventory: 50};

    resMock.send = function(status) {
      expect(status).to.equal('inventory decrease successful');
      done();
    };
    itemController.updateItem(reqMock, resMock);
  });

  it('should get test items' ,function(done) {

    reqMock.query = {cartItem: ''};

    resMock.send = function(object) {
      expect(object).to.have.property('item');
      expect(object).to.have.property('category');

      done();
    };
    itemController.getItems(reqMock, resMock);
  });

  it('should get correct items', function(done) {

    reqMock.query = {cartItems: [ { _id: '551cc20e47a654d14a280e9d',
      __v: '0',
      item:
      { _id: '5523cea79294d58a8e06c3c1',
        name: '2015欧美大牌春装新款 修身显瘦镂空蕾丝连衣裙中长款 夏短袖长裙',
        unit: '件',
        price: '368',
        image: 'image/14.jpg',
        inventory: '56',
        description: '这是......',
        category: '5523bc489294d58a8e06c38f',
        specification: '100ml',
        isRecommend: 'true' },
      number: '4' } ]};

    resMock.send = function(object) {
      expect(object[0]).to.have.property('name');
      expect(object.length).to.equal(1);
      expect(object[0].name).to.equal('2015欧美大牌春装新款 修身显瘦镂空蕾丝连衣裙中长款 夏短袖长裙');

      done();
    };
    itemController.getItems(reqMock, resMock);
  });

});

