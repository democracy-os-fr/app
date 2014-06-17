/**
 * Module dependencies.
 */

var empty = require('empty');
var events = require('events');
var inherit = require('inherit');
var o = require('query');
var serialize = require('serialize');
var View = require('view');

module.exports = FormView;

/**
 * Form view
 *
 * @return {FormView} `FormView` instance.
 * @param {Object|HTMLElement} el 
 * @api public
 */

function FormView(el) {
  if (!(this instanceof FormView))
    return inherit(el, FormView);
  
  View.call(this, el);

  this.switchOn();
}

inherit(FormView, View);

FormView.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('submit form');
};

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

FormView.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.errors();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);
  
  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.errors(errors);
    return;
  };

  // Deliver form submit
  this.emit('submit', data);
}

/**
 * Fill errors list
 *
 * @param {Array} errors
 * @api public
 */

FormView.prototype.errors = function(errors) {
  var ul = o('ul.form-errors', this.el);

  if (!arguments.length) return empty(ul);

  errors.forEach(function(e) {
    var li = document.createElement('li');
    li.innerHTML = e;
    ul.appendChild(li);
  });
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

FormView.prototype.validate = function(data) {
  var errors = [];
  return errors;
}