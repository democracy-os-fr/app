/**
 * Module dependencies.
 */

var t = require('t');
var template = require('./template');
var View = require('view');

function LawProposal(law, idx) {
  var colors = ["color-1", "color-2", "color-3"];
  this.law = law;
  this.color = colors[idx % 3];
  View.call(this, template, {law: law, color: this.color});
}

View(LawProposal);

module.exports = LawProposal;
