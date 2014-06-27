/*
 * Module dependencies.
 */

var Emitter = require('emitter');
var empty = require('empty');
var events = require('events');
var serialize = require('serialize');
var regexps = require('regexps');
var render = require('render');
var form = require('./reset-form');
var t = require('t');
var FormView = require('form-view');

/**
 * Expose ResetView.
 */

module.exports = ResetView;

/**
 * Proposal Comments view
 *
 * @return {ResetView} `ResetView` instance.
 * @api public
 */

function ResetView () {
  if (!(this instanceof ResetView)) {
    return new ResetView();
  };

  FormView.call(this, form);
}

/**
 * Inherit from FormView
 */

FormView(ResetView);

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

ResetView.prototype.validate = function(data) {
  var errors = [];
  if (!data.password.length) {
    errors.push('Password is not good enough.');
  };
  if (data.password !== data.re_password) {
    errors.push('Passwords do not match')
  };
  return errors;
}