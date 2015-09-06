/**
 * Module dependencies.
 */

var page = require('page');
var template = require('./template');
var t = require('t');
var View = require('view');
var LawProposal = require('law-proposal');
var log = require('debug')('democracyos:custom-view');

/**
 * Expose CustomView
 */

module.exports = CustomView;

/**
 * Creates a CustomView
 * domifies the template inside `this.el`
 */

function CustomView(laws) {
  if (!(this instanceof CustomView)) {
    return new CustomView();
  }

  View.call(this, template);

  var container = this.find('#laws');
  laws.forEach(function (law, idx) {
      var lawProposal = new LawProposal(law, idx);
      lawProposal.appendTo(container[0]);
  });

}

/**
 * Inherit from `View`
 */

View(CustomView);

/**
 * Turn on event bindings
 * called when inserted to DOM
 */

CustomView.prototype.switchOn = function() {
  var container = document.querySelector('#laws');
  var msnry = new Masonry( container, {
    itemSelector: '.law-proposal',
    columnWidth: '.law-proposal'
  });

  log('custom-view loaded') ;

};
