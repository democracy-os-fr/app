/**
 * Module dependencies.
 */

var View = require('view');
var t = require('t');
var template = require('./template');
var log = require('debug')('democracyos:data:user');
var request = require('request');

var List = require('list.js');
var ListFuzzySearch = require('list.fuzzysearch.js');

/**
 * Expose UserView
 */

module.exports = UserView;

/**
 * Creates a UserView
 * domifies the template inside `this.el`
 */

function UserView() {
  if (!(this instanceof UserView)) {
    return new UserView();
  }

  View.call(this, template);

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

  var container = this.find('#user-wrapper #content');

  request
  .get('/api/user/all')
  .end(onresponse.bind(this));

  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load users. Please try reloading the page. Thanks!';
      return this.error(message);
    }
    var users = res.body

    log(users);

    var options = {
      valueNames: ['avatar', 'fullName', 'email', 'country'],
      item: 'user-item',
      plugins: [ ListFuzzySearch() ]
    };

    var list = new List('user-wrapper', options, users) ;

    // container.html(JSON.stringify(users)) ;

  }

};
