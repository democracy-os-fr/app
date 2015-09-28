var fs = require('fs');
var path = require('path');
var forIn = require('mout/object/forIn');
var util = require('util') ;
var log = require('debug')('democracyos:data:country');


var available = fs.readdirSync(path.resolve(__dirname, 'lib')).map(function(v){
  return v.replace('.json', '');
});

var list = {} ;

log( util.format('%d countries found',available.length) ) ;

available.forEach(function(lang){
  var hash = Array() ;
  var dump = require( './lib/' + lang ) ;
  forIn(dump,function(v,k,o){
    hash.push({
      'code' : k ,
      'name' : v
    }) ;
  }) ;
  list[lang] = hash ;
  log(util.format('lang %s with %d entries',lang,hash.length)) ;
}) ;


module.exports = list ;
