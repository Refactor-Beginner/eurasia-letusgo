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


});

