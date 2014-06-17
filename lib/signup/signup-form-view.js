/*
 * Module dependencies.
 */

var t = require('t');
var Emitter = require('emitter');
var domify = require('domify');
var empty = require('empty');
var inherit = require('inherit');
var classes = require('classes');
var serialize = require('serialize');
var regexps = require('regexps');
var form = require('./signup-form');
var render = require('render');
var FormView = require('form-view');

/**
 * Expose SignupFormView.
 */

module.exports = SignupFormView;

/**
 * Proposal Comments view
 *
 * @return {SignupFormView} `SignupFormView` instance.
 * @api public
 */

function SignupFormView() {
  if (!(this instanceof SignupFormView)) {
    return new SignupFormView();
  };

  FormView.call(this, form);
}

inherit(SignupFormView, FormView);

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

SignupFormView.prototype.validate = function(data) {
  var errors = [];
  if (!data.password.length) {
    errors.push(t('Password is not good enough'));
  };
  if (data.password !== data.re_password) {
    errors.push(t('Passwords do not match'));
  };
  if (!regexps.email.test(data.email)) {
    errors.push(t('Email is not valid'));
  };
  if (!data.firstName.length) {
    errors.push(t('A firstname is required'));
  };
  if (!data.lastName.length) {
    errors.push(t('A lastname is required'));
  };
  return errors;
}

SignupFormView.prototype.showSuccess = function() {
  var form = this.el.querySelector('#signup-form');
  var success = this.el.querySelector('#signup-message');

  var welcomeMessage = this.el.querySelector('#signup-message h1');
  var firstName = this.el.querySelector('#signup-form #firstName');
  var lastName = this.el.querySelector('#signup-form #lastName');
  var fullname = firstName.value + ' ' + lastName.value;

  welcomeMessage.innerHTML = t("Welcome, {name}!", { name: fullname || t("Guest")})

  classes(form).add('hide');
  classes(success).remove('hide');
}
