/**
 * Module dependencies.
 */

var password = require('./password-template');
var serialize = require('serialize');
var classes = require('classes');
var Emitter = require('emitter');
var request = require('request');
var events = require('events');
var render = require('render');
var empty = require('empty');
var inherit = require('inherit');
var FormView = require('form-view');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:settings-password');

/**
 * Expose PasswordView
 */

module.exports = PasswordView;

/**
 * Creates a password edit view
 */

function PasswordView() {
  if (!(this instanceof PasswordView)) {
    return new PasswordView();
  };

  FormView.call(this, password);
}

inherit(PasswordView, FormView);

/**
 * Turn on event bindings
 */

PasswordView.prototype.switchOn = function() {
  FormView.prototype.switchOn.call(this);
  this.on('submit', this.formsubmit.bind(this));
  this.on('success', this.onsuccess.bind(this));
  this.on('error', this.onerror.bind(this));
}

/**
 * Turn off event bindings
 */

PasswordView.prototype.switchOff = function() {
  this.events.unbind();
  this.off();
}

/**
 * Handle `submit` event to
 * perform POST request with
 * data
 *
 * @param {Event} ev
 * @api private
 */

PasswordView.prototype.formsubmit = function(data) {
  var view = this;

  request
  .post('/settings/password')
  .send(data)
  .end(function(err, res) {
    view.emit('response', res);
    if (err || !res.ok) {
      return log('Fetch error: %o', err || res.error), view.emit('error', res.text);
    };
    if (res.body && res.body.error) {
      return view.emit('error', res.body.error);
    };

    view.emit('success', res.body);
  });
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

PasswordView.prototype.onerror = function(error) {
  log('Error: %o', error);
  this.messages([error]);
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

PasswordView.prototype.onsuccess = function() {
  log('Password updated');
  this.messages([t('Your password was successfuly updated')], 'success');
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

PasswordView.prototype.validate = function(data) {
  var errors = [];
  if (!data.password.length) {
    errors.push(t('Password is not good enough'));
  };
  if (data.password !== data.confirm_password) {
    errors.push(t('Passwords do not match'));
  };
  return errors;
}