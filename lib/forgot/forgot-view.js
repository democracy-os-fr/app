/*
 * Module dependencies.
 */

var Emitter = require('emitter');
var empty = require('empty');
var events = require('events');
var classes = require('classes');
var serialize = require('serialize');
var regexps = require('regexps');
var render = require('render');
var form = require('./forgot-form');
var t = require('t');
var FormView = require('form-view');

/**
 * Expose ForgotView.
 */

module.exports = ForgotView;

/**
 * Proposal Comments view
 *
 * @return {ForgotView} `ForgotView` instance.
 * @api public
 */

function ForgotView () {
  if (!(this instanceof ForgotView)) {
    return new ForgotView();
  };

  FormView.call(this, form);
}

/**
 * Inherit from `FormView`
 */

FormView(ForgotView);

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

ForgotView.prototype.validate = function(data) {
  var errors = [];
  if (!regexps.email.test(data.email)) {
    errors.push(t('Email is not valid'));
  };
  return errors;
}

/**
 * Show success message
 */

ForgotView.prototype.showSuccess = function() {
  var form = this.el.querySelector('#forgot-form form');
  var success = this.el.querySelector('#forgot-form p.success-message');

  classes(form).add('hide');
  classes(success).remove('hide');
}