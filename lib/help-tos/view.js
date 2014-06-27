/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./tos.md');
var template = require('./tos-template');
var View = require('view');
var o = require('query');
var log = require('debug')('democracyos:help-tos');

/**
 * Expose TOSView
 */

module.exports = TOSView;

/**
 * Creates a TOS view
 */

function TOSView() {
  if (!(this instanceof TOSView)) {
    return new TOSView();
  };

  View.call(this, template, { md: marked(md) });
}

/**
 * Inherit form View
 */

 View(TOSView);