/**
 * Module Dependencies
 */

var config = require('lib/config');
var available = config.availableLocales;
var forIn = require('mout/object/forIn');

var translations = {};

available.forEach(function(locale){
  var master = require('./lib/' + locale);

  var dump = require('../data-country/lib/' + locale);
  forIn(dump,function(v,k,o){
    master["country." + k] = v ;
  }) ;

  translations[locale] = master
});

// Show original translation on locale name
available.forEach(function(locale){
  var key = 'settings.locale.' + locale;
  var original = translations[locale][key];
  if (!original) return;

  available.forEach(function(_locale){
    if (locale === _locale) return;
    var current = translations[_locale][key] ? ' / ' + translations[_locale][key] : '';
    translations[_locale][key] = original + current;
  });
});

module.exports = translations;
