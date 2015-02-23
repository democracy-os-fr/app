/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

app.get('/custom-view', require('lib/layout'));

