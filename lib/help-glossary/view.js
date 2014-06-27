/**
 * Module dependencies.
 */

var marked = require('marked');
var md = require('./glossary.md');
var template = require('./glossary-template');
var View = require('view');
var events = require('events');
var classes = require('classes');
var o = require('query');
var t = require('t');
var log = require('debug')('democracyos:help-glossary');

/**
 * Expose GlossaryView
 */

module.exports = GlossaryView;

/**
 * Creates a Glossary view
 */

function GlossaryView(word) {
  if (!(this instanceof GlossaryView)) {
    return new GlossaryView(word);
  };

  this.word = word;
  View.call(this, template, { md: marked(md) });
}

/**
 * Inherit from View
 */

 View(GlossaryView);

GlossaryView.prototype.build = function() {
  View.prototype.build.call(this);
  if (!this.word) return;
  this.elWord = o('#' + this.word, this.el);
  classes(this.elWord).add('selected');
  var back = document.createElement('a');
  classes(back).add('back').add('pull-right');
  back.href = '#';
  back.innerHTML = t('Back');
  this.elWord.appendChild(back);
};

GlossaryView.prototype.switchOn = function() {
  View.prototype.switchOn.call(this);
  this.events.bind('click .back', 'onback');
};

GlossaryView.prototype.onback = function(ev) {
  ev.preventDefault();
  window.history.go(-1);
};

GlossaryView.prototype.scroll = function() {
  if (this.elWord) this.elWord.scrollIntoView();
};