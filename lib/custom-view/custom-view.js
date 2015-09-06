/**
 * Module dependencies.
 */

var page = require('page');
var sidebar = require('sidebar');
var CustomView = require('./view');
var classes = require('classes');
var bus = require('bus');
var lawsFilter = require('laws-filter');
var t = require('t');

page('/', sidebarready, function(ctx, next) {

  lawsFilter.set('sort', 'oldest-first') ;
  var laws = lawsFilter.items();

  var customView = new CustomView(laws);

  classes(document.body).remove("browser-page");
  classes(document.body).add("custom-view");

  customView.replace('#content');



});

function sidebarready(ctx, next) {
  sidebar.ready(next);
}
