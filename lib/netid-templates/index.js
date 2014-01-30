/**
 * Module dependencies.
 */

var o = require('query');
var render = require('render');
var empty = require('empty');

/**
 * Expose View
 */

exports.render = renderTemplate;
exports.templates = templates;

function renderTemplate(template, container) {
  if ('string' == typeof container) {
    container = o(container);
  }
  template = render.dom(templates(template));
  empty(container).appendChild(template);
}

function templates(template) {
  return require('./' + template);
}