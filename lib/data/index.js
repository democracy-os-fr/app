/**
 * Module dependencies.
 */

var express = require('express');

/**
 * Exports Application
 */

var app = module.exports = express();

app.get('/data', require('lib/layout'));
app.get('/data/home', require('lib/layout'));
app.get('/data/user', require('lib/layout'));
