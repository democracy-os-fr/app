/**
 * Module dependencies.
 */

var t = require('t');
var template = require('./template');
var View = require('view');
var S = require('string.js');
var log = require('debug')('democracyos:law-proposal');

function LawProposal(law, idx) {
  var colors = ['#46336e', '#6f3060', '#9a2d53', '#c32c46', '#ec2939'];
  this.color = colors[idx % 5];
  law.color = this.color;
  this.law = law;

  law.description = S(law.summary).stripTags('img','iframe','a').truncate(256,' [...]').s ;
  log(law.description) ;

  log(law) ;
  log(law.participants.length) ;

  View.call(this, template, {law: law, color: this.color});
}

View(LawProposal);

module.exports = LawProposal;
