/**
 * Module dependencies.
 */

var closest = require('closest');
var dosMarkdown = require('markdown');
var events = require('events');
var marked = require('marked');
var o = require('query');
var View = require('view');
var t = require('t');
var template = require('./template');


/**
 * Expose HelpView.
 */

module.exports = HelpView;

/**
 * DemocracyOS markdown guide HelpView
 *
 * @return {HelpView} `HelpView` instance.
 * @api public
 */

function HelpView() {
  if (!(this instanceof HelpView)) {
    return new HelpView();
  };

  View.call(this, template, { marked: marked, dosMarkdown: dosMarkdown });
}

/**
 * Inherit from View
 */

 View(HelpView);

/**
 * Switch on events
 *
 * @api public
 */

HelpView.prototype.switchOn = function() {
  View.prototype.switchOn.call(this);
  this.events.bind('keyup textarea.playground', 'onchange');
};

/**
 * Switch off events
 *
 * @api public
 */

HelpView.prototype.switchOff = function() {
  this.events.unbind();
}

/**
 * On text change
 *
 * @param {Object} data
 * @api public
 */

HelpView.prototype.onchange = function(ev) {
  var target = ev.delegateTarget || closest(ev.target, 'textarea');
  var result = o('.result', this.el);
  var value = target.value;
 
  if (value != '') {
    result.innerHTML = dosMarkdown(target.value);
  } else {
    result.innerHTML = t('markdown.playground.text');
  }
};