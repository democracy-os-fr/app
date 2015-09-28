/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var restrict = utils.restrict;
var staff = utils.staff;
var log = require('debug')('democracyos:data-api');

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.get('/user/all', restrict, staff, function (req, res) {
  log('Request /user/all');
  var query = { publishedAt: { $exists: true } };
  var count = true;

  api.user.all(function (err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Found %d registered citizens', citizens.length);

    var registeredCitizens = citizens.length;

    var keys = [ 'id fullName avatar notifications locale country' ] ;

    log(citizens) ;
    res.json(citizens);

  });

});

function _handleError (err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}
