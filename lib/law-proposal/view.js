/**
 * Module dependencies.
 */

var t = require('t');
var template = require('./template');
var View = require('view');

function LawProposal(law, idx) {
  var colors = ["#7a1533", "#cf423b", "#fc7d4a"];
  this.color = colors[idx % 3];
  law.color = this.color;
  this.law = law;
  View.call(this, template, {law: law, color: this.color});
}

View(LawProposal);

module.exports = LawProposal;
