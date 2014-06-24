/**
 * Module dependencies.
 */

var form = require('./form-template');
var serialize = require('serialize');
var images = require('tag-images');
var classes = require('classes');
var Emitter = require('emitter');
var request = require('request');
var regexps = require('regexps');
var events = require('events');
var empty = require('empty');
var tags = require('tags');
var o = require('query');
var t = require('t');
var FormView = require('form-view');
var inherit = require('inherit');
var log = require('debug')('democracyos:admin-tags-form');

/**
 * Expose TagForm
 */

module.exports = TagForm;

/**
 * Creates a password edit view
 */

function TagForm(tag) {
  if (!(this instanceof TagForm)) {
    return new TagForm(tag);
  };

  if (tag) {
    this.action = '/tag/' + tag.id;
    this.title = 'admin-tags-form.title.edit';
  } else {
    this.action = '/tag/create';
    this.title = 'admin-tags-form.title.create';
  }

  this.tag = tag;

  FormView.call(this, form, {
    form: { title: this.title, action: this.action },
    tag: this.tag || { clauses: [] },
    images: images
  });
}

inherit(TagForm, FormView);

/**
 * Turn on event bindings
 */

TagForm.prototype.switchOn = function() {
  FormView.prototype.switchOn.call(this);
}

/**
 * Turn off event bindings
 */

TagForm.prototype.switchOff = function() {
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

TagForm.prototype.formsubmit = function(data) {
  var view = this;

  request
  .post('/api' + this.action)
  .send(data)
  .end(function(err, res) {
    view.emit('response');

    if (err || !res.ok) {
      return log('Fetch error: %o', err || res.error), view.emit('error', res.body || res.text);
    };
    if (res.body && res.body.error) {
      return view.emit('error', res.body.error);
    };

    tags.fetch();
    tags.ready(function () {
      view.emit('success', res.body);
    });
  });
}

/**
 * Handle `error` event with
 * logging and display
 *
 * @param {String} error
 * @api private
 */

TagForm.prototype.onsuccess = function() {
  log('Law create successful');
  this.messages([t('admin-tags-form.message.onsuccess')]);
}

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

TagForm.prototype.validate = function(data) {
  var errors = [];
  if (!data.name.length) {
    errors.push(t('admin-tags-form.message.validation.name-required'));
  };
  return errors;
}