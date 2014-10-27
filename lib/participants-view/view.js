/**
 * Module dependencies.
 */

var request = require('request');
var events = require('events');
var classes = require('classes');
var Emitter = require('emitter');
var participant = require('./participant');
var box = require('./box');
var render = require('render');
var tip = require('tip')
var o = require('query');
var log = require('debug')('democracyos:participants-view');
var Ractive = require('ractive');
var bus = require('bus');
var citizen = require('citizen');
var indexOf = require('indexof');

/**
 * Expose View
 */

module.exports = View;

/**
 * Participants View Class
 *
 * @param {Array} participants array of ids
 * @api public
 */

function View(participants) {
  if (!(this instanceof View)) {
    return new View(participants);
  };

  this.boxTpl = render.dom(box).textContent;
  this.participantTpl = participant();
  this.participants = participants;
  this.events = events(this.boxTpl, this);
  this.switchOn();
}

View.prototype.render = function(el) {
  this.view = new Ractive({
    el: el,
    template: this.boxTpl,
    partials: { participant: this.participantTpl },
    data: { participants: this.participants }
  });
};

Emitter(View.prototype);

View.prototype.switchOn = function() {
  this.on('fetch', this.load.bind(this));
  bus.on('vote', this.onvote.bind(this));
  //this.events.bind('click a.view-more', 'more');
}

View.prototype.onvote = function() {
  if (~this.participants.indexOf(citizen)) return;
  this.participants.push(citizen);
  this.fetch();
};

View.prototype.switchOff = function() {
  this.off('fetch');
  this.events.unbind();
}

View.prototype.destroy = function() {
  // Detach el from DOM
  this.switchOff();
}

View.prototype.fetch = function() {
  var view = this;
  var p = view.participants.map(function(i) {
    if (typeof i === "object")
      return i.id;

    return i;
  });

  request
  .post('/api/citizen/lookup')
  .send({ ids: p })
  .end(function(err, res) {
    if (err || !res.ok) {
      return log('Fetch error: %s', err || res.error);
    };
    if (res.body && res.body.error) {
      return log('Error: %o', res.body.error);
    };

    view.emit('fetch', res.body || []);
  });
}

View.prototype.load = function(participants) {
  this.view.set('participants', participants);
}

View.prototype.more = function(ev) {
  ev.preventDefault();

  var btn = o('a.view-more', this.boxTpl);
  classes(btn).add('hide');

  var hiddens = o.all('a.participant-profile.hide', this.boxTpl) || [];
  for (var i = 0, h = hiddens[i]; i < hiddens.length; i++, h = hiddens[i]) {
    classes(h).remove('hide');
  }
}