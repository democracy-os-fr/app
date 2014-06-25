/**
 * Module dependencies.
 */

var list = require('./list-template');
var tags = require('tags');
var Emitter = require('emitter');
var events = require('events');
var View = require('view');
var o = require('query');
var diacritics = require('diacritics').remove;
var log = require('debug')('democracyos:admin-tags:list-view');

/**
 * Expose ListView
 */

module.exports = ListView;

/**
 * Creates a list view of tags
 */

function ListView() {
  if (!(this instanceof ListView)) {
    return new ListView();
  };

  View.call(this, list, {
    tags: tags.get().sort(sort)
  });
}

/**
 * Inherit from View
 */

View(ListView);

function sort(a, b) {
  if (diacritics(a.name.toLowerCase()) < diacritics(b.name.toLowerCase())) {
    return -1;
  }
  if (diacritics(a.name.toLowerCase()) > diacritics(b.name.toLowerCase())) {
    return 1;
  }
  return 0;
}