/**
 * Module dependencies.
 */

var identity = require('./identity-template');
var serialize = require('serialize');
var classes = require('classes');
var Emitter = require('emitter');
var request = require('request');
var citizen = require('citizen');
var events = require('events');
var render = require('render');
var empty = require('empty');
var o = require('query');
var t = require('t');
var Toggle = require('toggle');
var log = require('debug')('democracyos:settings-identity');

/**
 * Expose IdentityView
 */

module.exports = IdentityView;

/**
 * Creates a identity enabling view
 */

function IdentityView() {
  if (!(this instanceof IdentityView)) {
    return new IdentityView();
  };

  this.el = render.dom(identity);
  this.toggle = new Toggle();
  this.toggle.label(' ', ' ');
  o('#identity-enable', this.el).appendChild(this.toggle.el);

  this.events = events(this.el, this);
  this.switchOn();
}

/**
 * Mixin with `Emitter`
 */

Emitter(IdentityView.prototype);


/**
 * Turn on event bindings
 */

IdentityView.prototype.switchOn = function() {
  this.events.bind('submit form');
  this.events.bind('click #identity-enable', 'ontoggleclick');
  this.on('submit', this.formsubmit.bind(this));
  this.on('success', this.onsuccess.bind(this));
  this.on('error', this.onerror.bind(this));
}

/**
 * Turn off event bindings
 */

IdentityView.prototype.switchOff = function() {
  this.events.unbind();
  this.off();
}

/**
 * Handle `ontoggleclick` form event
 *
 * @param {Event} ev
 * @api private
 */

IdentityView.prototype.ontoggleclick = function(ev) {
  if (this.toggle.value()) {

  }
}

/**
 * Handle `onsubmit` form event
 *
 * @param {Event} ev
 * @api private
 */

IdentityView.prototype.onsubmit = function(ev) {
  ev.preventDefault();
  
  // Clean errors list
  this.messages();

  // Serialize form
  var form = o('form', this.el);
  var data = serialize.object(form);
  
  // Deliver form submit
  this.emit('submit', data);
}

/**
 * Handle `submit` event to
 * perform POST request with
 * data
 *
 * @param {Event} ev
 * @api private
 */

IdentityView.prototype.formsubmit = function(data) {
  var view = this;

  request
  .post('/settings/identity')
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

IdentityView.prototype.onerror = function(error) {
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

IdentityView.prototype.onsuccess = function() {
  log('Identity enabling updated');
  citizen.load('me');
  this.messages([t('Your identity settings were updated')], 'success');
}

/**
 * Fill messages list
 *
 * @param {Array} msgs
 * @param {string} type
 * @api public
 */

IdentityView.prototype.messages = function(msgs, type) {
  var ul = o('ul.form-messages', this.el);

  if (!arguments.length) return empty(ul);

  msgs.forEach(function(m) {
    var li = document.createElement('li');
    li.innerHTML = m;
    classes(li).add(type || 'error');
    ul.appendChild(li);
  });
}

/**
 * Renders to provided `el`
 * or delivers view's `el`
 *
 * @param {Element} el
 * @return {IdentityView|Element}
 * @api public
 */

IdentityView.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = o(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    return this;
  };

  return this.el;
}