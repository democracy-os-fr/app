/**
 * Module dependencies.
 */

var View = require('view');
var t = require('t');
var template = require('./template');
var log = require('debug')('democracyos:data-view-user');

/**
 * Expose UserView
 */

module.exports = UserView;

/**
 * Creates a UserView
 * domifies the template inside `this.el`
 */

function UserView(laws) {
  if (!(this instanceof UserView)) {
    return new UserView();
  }

  View.call(this, template);

  var container = this.find('#data-view-user');

  log('data-view-user loaded') ;

}

/**
 * Inherit from `View`
 */

View(UserView);

/**
 * Turn on event bindings
 * called when inserted to DOM
 */

UserView.prototype.switchOn = function() {

  log('data-view-user switchOn') ;

};
