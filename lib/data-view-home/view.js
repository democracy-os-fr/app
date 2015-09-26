/**
 * Module dependencies.
 */

var View = require('view');
var t = require('t');
var template = require('./template');
var log = require('debug')('democracyos:data-view-home');

/**
 * Expose HomeView
 */

module.exports = HomeView;

/**
 * Creates a HomeView
 * domifies the template inside `this.el`
 */

function HomeView(laws) {
  if (!(this instanceof HomeView)) {
    return new HomeView();
  }

  View.call(this, template);

  var container = this.find('#data-view-home');

  log('data-view-home loaded') ;

}

/**
 * Inherit from `View`
 */

View(HomeView);

/**
 * Turn on event bindings
 * called when inserted to DOM
 */

HomeView.prototype.switchOn = function() {

  log('data-view-home switchOn') ;

};
