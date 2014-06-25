/**
 * Module dependencies.
 */

var classes = require('classes');
var Emitter = require('emitter');
var events = require('events');
var log = require('debug')('democracyos:comments-edit');
var o = require('query');
var FormView = require('form-view');
var request = require('request');
var t = require('t');
var template = require('./comments-edit');
var serialize = require('serialize');
var inherit = require('inherit');


/**
 * Expose comments view
 */

module.exports = CommentsEditView;

/**
 * View constructor
 *
 * @param {Comment} comment
 * @constructor
 */

function CommentsEditView(comment) {
  if (!(this instanceof CommentsEditView)) {
    return new CommentsEditView(comment);
  };

  this.comment = comment;

  FormView.call(this, template, {comment: this.comment});
}

inherit(CommentsEditView, FormView);

/**
 * Switch on events
 *
 * @api public
 */

CommentsEditView.prototype.switchOn = function() {
  FormView.prototype.switchOn.call(this);
  this.on('submit', this.put.bind(this));
  this.events.bind('click form.comment-edit-form .btn-cancel', 'oncancel');
};

/**
 * Switch off events
 *
 * @api public
 */

CommentsEditView.prototype.switchOff = function() {
  this.off('put');
  this.emit('off', this.el);
  this.events.unbind();
}

/**
 * Put a comment
 *
 * @param {Object} data
 * @api public
 */

CommentsEditView.prototype.put = function(data) {
  var view = this;

  request
  .put(this.url())
  .send({ text: data.text })
  .end(function(err, res) {
    
    if (res.body && res.body.error) {
      return log('Fetch response error: %s', res.body.error), view.errors([res.body.error]);
    };

    if (err || !res.ok) return log('Fetch error: %s', err || res.error);

    view.emit('put', { data: res.body, el: view.el });
  });
}

/**
 * On cancel editing a comment
 *
 * @param {Object} data
 * @api public
 */

CommentsEditView.prototype.oncancel = function(ev) {
  ev.preventDefault();
  classes(this.el.parentNode).remove('edit');
  this.switchOff();
};

/**
 * Validate form's fields
 *
 * @param {Object} data
 * @return {Array} of Errors
 * @api public
 */

CommentsEditView.prototype.validate = function(data) {
  var errors = [];
  if (!data.text) {
    errors.push(t('Argument cannot be empty'));
  };
  if (data.text.length > 4096) {
    errors.push(t('Argument is limited to 4096 characters'));
  };
  return errors;
}

/**
 * Get api route
 */

CommentsEditView.prototype.url = function() {
  return "/api/comment/{reference}"
    .replace('{reference}', this.comment.id);
}