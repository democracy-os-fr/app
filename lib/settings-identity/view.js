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

  this.build();
  this.switchOn();
}

/**
 * Mixin with `Emitter`
 */

Emitter(IdentityView.prototype);

IdentityView.prototype.build = function () {
  this.el = render.dom(identity);
  this.toggle = new Toggle(citizen.netid);
  this.toggle.label(' ', ' ');
  o('#identity-enable', this.el).appendChild(this.toggle.el);
  this.status = o('.toggle-status', this.el);
  this.toggleStatus(citizen.netid ? 'enabled' : 'disabled');
  this.events = events(this.el, this);

  var onclick = this.toggle.onclick;
  var view = this;
  
  this.toggle.onclick = function (ev) {
    //onclick.apply(this, arguments);
    view.ontoggleclick(ev);
  };

  this.verifyIdentity();
}

IdentityView.prototype.verifyIdentity = function () {
  var view = this;

  request
  .post('/identity/verify')
  .send()
  .end(function(err, res) {
    var msg = '';
    var type = '';

    if (res.status == 200) {
      msg = t('settings.identity-validation.identity-verified');
      type = 'success';
    } else if (res.status == 403) {
      msg = t('settings.identity-validation.identity-not-verified');
      type = 'error';
    } else {
      msg = t('settings.identity-validation.error-verifying');
      type = 'error';
    }
    view.messages([msg], type);
  });
}

IdentityView.prototype.toggleStatus = function (msg) {
  var message = '';
  var status = this.toggle.value();
  switch (msg) {
    case 'error':
      message = t('Error');
      status = false;
      break;
    case 'enabled':
      message = t('Conectado');
      status = true
      /*var resultMessages = o('.result-messages', this.el);
      resultMessages.innerHTML = t('settings.identity-validation.process-started');*/
      break;
    case 'connecting':
      message = t('Conectando...');
      status = true;
      break;
    case 'disabled':
      message = t('Desconectado');
      status = false;
      break;
  }
  this.toggle.value(status);
  this.status.innerHTML = message;
}

/**
 * Turn on event bindings
 */

IdentityView.prototype.switchOn = function() {
  this.on('success', this.onsuccess.bind(this));
  this.on('error', this.onerror.bind(this));
  //this.toggleStatus(citizen.netid ? 'enabled' : 'disabled');
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
  var view = this;
  var status = this.toggle.value();

  this.messages([]);
  this.toggleStatus(status ? 'disabled' : 'connecting');


  var endpoint = '/settings/identity/' + (status ? 'disable' : 'enable');
  request
  .post(endpoint)
  .send()
  .end(function(err, res) {
    console.log(err);
    console.log(res);
    if (!res) {
      view.emit('error', new Error(t('settings.identity-validation.request-error')));
    }
    if (err || !res.ok) {
      view.emit('error', new Error(t('settings.identity-validation.request-error')));
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
  var view = this;
  setTimeout(function () {
    view.toggleStatus('error');
    view.messages([error]);  
  }, 500);
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
  this.toggleStatus(this.toggle.value() ? 'enabled' : 'disabled');
  citizen.load('me');
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
  empty(ul);

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