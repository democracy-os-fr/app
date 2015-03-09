/**
 * Module dependencies.
 */

var config = require('lib/config');
var db = require('lib/db');
var mongoose = require('mongoose');

var mongoUrl = config('mongoUsersUrl') || config('mongoUrl');
var createConnection = config('mongoUsersUrl') !== config('mongoUrl');

// TODO: find a way of reusing original mongo connection if userDB is not set
var conn;
if (createConnection) {
  conn = db.connect(mongoUrl, { createConnection: createConnection });
} else {
  conn = mongoose;
}

module.exports = conn;
