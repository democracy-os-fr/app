/**
 * Module dependencies.
 */

var View = require('view');
var t = require('t');
var template = require('./template');
var log = require('debug')('democracyos:data:home');
var request = require('request');


/**
 * Expose HomeView
 */

module.exports = HomeView;

/**
 * Creates a HomeView
 * domifies the template inside `this.el`
 */

function HomeView() {
  if (!(this instanceof HomeView)) {
    return new HomeView();
  }


  View.call(this, template);

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

  var container = this.find('#data-view-home');

  request
  .get('/stats')
  .end(onresponse.bind(this));
  
  function onresponse(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load stats. Please try reloading the page. Thanks!';
      return this.error(message);
    }
    var stats = res.body

    log(stats);

    container.find('#stats-citizens').html(stats.citizens) ;
    container.find('#stats-laws').html(stats.laws) ;
    container.find('#stats-rated').html(stats.rated) ;
    container.find('#stats-votes').html(stats.votes) ;
    container.find('#stats-replies').html(stats.replies) ;
    container.find('#stats-comments').html(stats.comments) ;
    container.find('#stats-emailValidatedCitizens').html(stats.emailValidatedCitizens) ;

  }

};
