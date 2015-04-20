'use strict';

var errorHandler = function (status, msg){
  var err = new Error(msg);
  err.status = status;
  return err;
};

module.exports = errorHandler;

