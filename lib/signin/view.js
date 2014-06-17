/*
 * Module dependencies.
 */

var t = require('t');
var Emitter = require('emitter');
var empty = require('empty');
var events = require('events');
var serialize = require('serialize');
var regexps = require('regexps');
var inherit = require('inherit');
var form = require('./form');
var FormView = require('form-view');
var o = require('query');

/**
 * Expose SigninFormView.
 */

module.exports = SigninFormView;

/**
 * Signin FormSigninview
 *
 * @return {SigninFormView} `SigninFormView` instance.
 * @api public
 */

function SigninFormView () {
  if (!(this instanceof SigninFormView)) {
    return new SigninFormView();
  };

  FormView.call(this, form);
}

inherit(SigninFormView, FormView);

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

SigninFormView.prototype.validate = function(data) {
  var errors = [];
  if (!data.password.length) {
    errors.push(t('Password is required'));
  };
  if (!regexps.email.test(data.email)) {
    errors.push(t('Email is not valid'));
  };
  return errors;
}