/**
 * Module dependencies.
 */

var empty = require('empty');
var events = require('events');
var inherit = require('inherit');
var o = require('query');
var serialize = require('serialize');
var classes = require('classes');
var View = require('view');

module.exports = FormView;

/**
 * Form view
 *
 * @return {FormView} `FormView` instance.
 * @param {Object|HTMLElement} el 
 * @api public
 */

function FormView(el, locals) {
  if (!(this instanceof FormView))
    return inherit(el, FormView);
  
  View.call(this, el, locals);

  this.switchOn();
}

inherit(FormView, View);

FormView.prototype.switchOn = function() {
  this.events = events(this.el, this);
  this.events.bind('submit form');
  this.on('response', this.reenable.bind(this));
  this.on('error', this.onerror.bind(this));
  if (this.formsubmit) this.on('submit', this.formsubmit.bind(this));
  if (this.onsuccess) this.on('success', this.onsuccess.bind(this));
};

FormView.prototype.reenable = function() {
  var submit = o('input[type="submit"]', this.el);
  submit.disabled = false;
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
  this.messages();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);
  
  // Prepare data
  if (this.prepare) this.prepare(data);

  // Check for errors in data
  var errors = this.validate(data);

  // If errors, show and exit
  if (errors.length) {
    this.errors(errors);
    return;
  };

  // Sanitize data before submitting
  if (this.sanitize) this.sanitize(data);

  // Disable form submit button
  var submit = o('input[type="submit"]', this.el);
  submit.disabled = true;

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
  if (!ul) return;

  if (!arguments.length) return empty(ul);

  errors.forEach(function(e) {
    var li = document.createElement('li');
    li.innerHTML = e;
    ul.appendChild(li);
  });
}

/**
 * Fill messages list
 *
 * @param {Array} msgs
 * @param {string} type
 * @api public
 */

FormView.prototype.messages = function(msgs, type) {
  var ul = o('ul.form-messages', this.el);
  if (!ul) return;

  if (!arguments.length) return empty(ul);

  msgs.forEach(function(m) {
    var li = document.createElement('li');
    li.innerHTML = m;
    classes(li).add(type || 'error');
    ul.appendChild(li);
  });
}

/**
 * Handle `error` event with
 * logging and display sent from server
 *
 * @param {String} error
 * @api private
 */

FormView.prototype.onerror = function(error) {
  log('Error: %o', error);
  this.messages([error]);
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