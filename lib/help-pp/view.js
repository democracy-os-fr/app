/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./pp.md');
var template = require('./pp-template');
var View = require('view');
var o = require('query');
var log = require('debug')('democracyos:help-pp');

/**
 * Expose PrivacyPolicyView
 */

module.exports = PrivacyPolicyView;

/**
 * Creates a Privacy Policy view
 */

function PrivacyPolicyView() {
  if (!(this instanceof PrivacyPolicyView)) {
    return new PrivacyPolicyView();
  };

  View.call(this, template, { md: marked(md) });
}

/**
 * Inherit from View
 */

 View(PrivacyPolicyView);