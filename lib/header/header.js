/**
 * Module dependencies.
 */

var citizen = require('citizen');
var template = require('./header-container');
var snapper = require('snapper');
var View = require('view');
// var feedback = require('feedback');
var render = require('render');
var o = require('query');
var log = require('debug')('democracyos:header:view');

/**
 * Expose HeaderView
 */

module.exports = HeaderView;

/**
 * Create Sidebar List view container
 */

function HeaderView() {
  View.call(this, template);

  // Prep event handlers
  this.refresh = this.refresh.bind(this);

  this.switchOn();
}

/**
 * Inherit from View
 */

View(HeaderView);

HeaderView.prototype.switchOn = function() {
  snapper(this.el);
  citizen.on('loaded', this.refresh);
  citizen.on('unloaded', this.refresh);
  // setTimeout(feedback.bind, 0);
}

HeaderView.prototype.switchOff = function() {
  snapper.destroy();
  citizen.off('loaded', this.refresh);
  citizen.off('unloaded', this.refresh);
}

HeaderView.prototype.refresh = function () {
  var old = this.el;
  this.switchOff();
  this.build();
  this.switchOn();

  if (old.parentNode) old.parentNode.replaceChild(this.el, old);
  old.remove();
}