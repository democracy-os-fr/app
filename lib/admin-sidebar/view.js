/**
 * Module dependencies.
 */

var template = require('./sidebar-template');
var classes = require('classes');
var View = require('view');
var o = require("query");

module.exports = Sidebar;

/**
 * Creates `Sidebar` view for admin
 */
function Sidebar() {
  if (!(this instanceof Sidebar)) {
    return new Sidebar();
  };

  View.call(this, template);
}

/**
 * Inherit from View
 */

View(Sidebar);

Sidebar.prototype.set = function(section) {
  this.unset();
  var select = o('a[href="/admin/' + section + '"]', this.el);
  if (select) classes(select).add('active');
};

Sidebar.prototype.unset = function() {
  var actives = o.all(".active", this.el);

  if (!actives) return this;

  for (var i = 0; i < actives.length; i++) {
    classes(actives[i]).remove('active');
  };

  return this;
};