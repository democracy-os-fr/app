/**
 * Module dependencies.
 */

var profile = require('./profile-template');
var serialize = require('serialize');
var classes = require('classes');
var Emitter = require('emitter');
var regexps = require('regexps');
var request = require('request');
var citizen = require('citizen');
var events = require('events');
var render = require('render');
var empty = require('empty');
var inherit = require('inherit');
var FormView = require('form-view');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:settings-profile');

/**
 * Expose ProfileView
 */

module.exports = ProfileView;

/**
 * Creates a profile edit view
 */

function ProfileView() {
  if (!(this instanceof ProfileView)) {
    return new ProfileView();
  };

  FormView.call(this, profile);
}

inherit(ProfileView, FormView);

/**
 * Mixin with `Emitter`
 */

Emitter(ProfileView.prototype);


/**
 * Turn on event bindings
 */

ProfileView.prototype.switchOn = function() {
  FormView.prototype.switchOn.call(this);
  this.on('submit', this.formsubmit.bind(this));
  this.on('success', this.onsuccess.bind(this));
  this.on('error', this.onerror.bind(this));
}

/**
 * Turn off event bindings
 */

ProfileView.prototype.switchOff = function() {
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

ProfileView.prototype.formsubmit = function(data) {

  // Temporarily disable email submission, until we fix the whole flow
  // Also check ./settings/index.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  if (data.email) delete data.email;

  var view = this;

  request
  .post('/settings/profile')
  .send(data)
  .end(function(err, res) {
    if (err || !res.ok) {
      return log('Fetch error: %s', err || res.error);
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

ProfileView.prototype.onerror = function(error) {
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

ProfileView.prototype.onsuccess = function() {
  log('Profile updated');
  citizen.load('me');
  this.messages([t('Your profile was successfuly updated')], 'success');
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

ProfileView.prototype.validate = function(data) {
  var errors = [];
  if (!isValidNameInput(data.firstName)) {
    errors.push(t('First name isn\'t valid'));
  };
  if (data.firstName.length > 100) { 
    errors.push(t('First name should be 100 characters or less'));
  };
  if (!isValidNameInput(data.lastName)) {
    errors.push(t('Last name isn\'t valid'));
  };
  if (data.firstName.length > 100) { 
    errors.push(t('Last name should be 100 characters or less'));
  };
  // Temporarily disable email validation, until we fix the whole flow
  // Also check ./settings/index.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  // if (!regexps.email.test(data.email)) {
  //   errors.push(t('Email is not valid'));
  // };
  return errors;
}

/**
 * Sanitizes form input data. This function has side effect on parameter data.
 * @param  {Object} data
 */
ProfileView.prototype.sanitize = function(data) {
  data.firstName = data.firstName.trim().replace(/\s+/g, ' ');
  data.lastName = data.lastName.trim().replace(/\s+/g, ' ');
  // Temporarily disable email sanitization, until we fix the whole flow
  // Also check ./settings/index.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  // data.email = data.lastName.trim();
}

function isValidNameInput(value) {
  return value && (typeof value === 'string') && (value.length > 0) && !regexps.blank.test(value) && regexps.names.test(value)
}