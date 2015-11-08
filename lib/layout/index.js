/**
 * Module dependencies.
 */

var config = require('lib/config');
var clientConfig = require('lib/config/client');
var translations = require('lib/translations');
var countries = require('lib/data-country');
var path = require('path');
var resolve = path.resolve;
var html = resolve(__dirname, 'index.jade');

module.exports = function (req, res) {
  var locale = req.locale;

  res.render(html, {
    config: config,
    client: clientConfig,
    locale: locale,
    countries: countries[locale],
    translations: translations[locale]
  });
};
