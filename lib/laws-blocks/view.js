/**
 * Module dependencies.
 */

var template = require('./template');
var View = require('view');
var LawProposal = require('law-proposal');

function LawsBlocks(laws) {
  if (!(this instanceof LawsBlocks)) {
    return new LawsBlocks();
  }

  View.call(this, template);

  var container = this.find('.laws');
  laws.forEach(function (law) {
      console.log(law);
      var lawProposal = new LawProposal(law, { delayNextLaw: false });
      lawProposal.el
        .addClass('col-md-4');

      lawProposal.appendTo(container[0]);
  });
}

View(LawsBlocks);

/**
 * Expose LawsBlocks
 */

module.exports = LawsBlocks;
