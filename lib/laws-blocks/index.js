/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

app.get('/laws-blocks', require('lib/layout'));
