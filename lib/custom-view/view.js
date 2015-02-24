/**
 * Module dependencies.
 */

var page = require('page');
var template = require('./template');
var t = require('t');
var View = require('view');
var LawProposal = require('law-proposal');

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
  };

  View.call(this, template);

  var container = this.find('.laws');
  laws.forEach(function (law, idx) {
      var lawProposal = new LawProposal(law, idx);
      lawProposal.el
        .addClass('col-md-4');

      lawProposal.appendTo(container[0]);
  });

}

/**
 * Inherit from `View`
 */

View(CustomView);
