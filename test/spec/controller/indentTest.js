'use strict';

describe('GET api/indent', function() {

  var resMock = {};
  var reqMock = {};
  var next;

  var indentController = require('../../../controller/indentController');

  it('should get total and indent', function(done) {

    resMock.send = function(object) {

      expect(object).to.have.property('indent');
      expect(object).to.have.property('total');
      expect(object.total).to.equal('3334.50');

      done();
    };

    indentController.getIndent(reqMock, resMock, next);
  });

  it('should render indent page', function(done) {
    resMock.render = function(view, object) {

      expect(view).to.equal('indent');
      expect(object).to.have.property('cartItems');
      expect(object.cartItems[2].item.shortName).to.equal('2015欧美大牌春装...');
      expect(object).to.have.property('indent');
      expect(object.total).to.equal('3334.50');
      expect(object.shortedCartItemName).to.equal('Nestle雀巢(三合一)速溶咖啡180ml 罐装');

      done();
    };

    indentController.renderIndentPage(reqMock, resMock, next);
  });

  afterEach(function() {

    reloadDatabase();
  });
});
