var available = require('./available');
var forIn = require('mout/object/forIn');

available.forEach(function(locale){
  var master = require('./lib/' + locale);

  var dump = require('../data-country/lib/' + locale);
  forIn(dump,function(v,k,o){
    master["country." + k] = v ;
  }) ;

  module.exports[locale] = master;
});
