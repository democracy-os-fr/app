/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./faq.md');
var template = require('./faq-template');
var View = require('view');
var o = require('query');
var log = require('debug')('democracyos:help-faq');

/**
 * Expose FAQView
 */

module.exports = FAQView;

/**
 * Creates a FAQ view
 */

function FAQView() {
  if (!(this instanceof FAQView)) {
    return new FAQView();
  };

  View.call(this, template, { md: marked(md) });
}

/**
 * Inherit from View
 */

 View(FAQView);