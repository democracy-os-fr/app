/**
 * Module dependencies.
 */

var o = require('query');
var inherit = require('inherit');
var render = require('render');

/**
 * Expose View
 */

module.exports = View;

/**
 * Create View class
 */

function View(template, opts) {
  if (!(this instanceof View))
    return inherit(template, View);
  
  this.template = template;
  this.opts = opts || {};
  this.build();
}

/**
 * Build current `el`
 * from template
 */

View.prototype.build = function() {
  this.el = render.dom(this.template, this.opts);
};

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