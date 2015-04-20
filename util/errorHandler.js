'use strict';

var errorHandler = function (status, massage){
  var err = new Error(massage);
  err.status = status;
  return err;
};

module.exports = errorHandler;

