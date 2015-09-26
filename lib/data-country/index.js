var fs = require('fs');
var path = require('path');
var forIn = require('mout/object/forIn');

console.log('data-country - index.js') ;

var available = fs.readdirSync(path.resolve(__dirname, 'lib')).map(function(v){
  return v.replace('.json', '');
});

var list = {} ;

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
}) ;

module.exports = list ;
