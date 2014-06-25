/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var inherit = require('inherit');
var o = require('query');
var render = require('render');
var events = require('events');

/**
 * Expose View
 */

module.exports = View;

/**
 * Create View class
 */

function View(template, locals) {
  if (!(this instanceof View))
    return inherit(template, View);
  
  Emitter.call(this);
  this.template = template;
  this.locals = locals || {};
  this.build();
  this.switchOn();
}

/**
 * Inherit from Emitter
 */

inherit(View, Emitter);

/**
 * Build current `el`
 * from template
 */

View.prototype.build = function() {
  this.el = render.dom(this.template, this.locals);
};

/**
 * Turn on event bindings
 */

View.prototype.switchOn = function() {
  this.events = events(this.el, this);
}

/**
 * Turn off event bindings
 */

View.prototype.switchOff = function() {
  this.events.unbind();
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {LawForm|Element}
 * @api public
 */

 View.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    return this;
  };

  return this.el;
};