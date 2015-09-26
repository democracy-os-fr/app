/**
 * Module dependencies.
 */

var config = require('config');
var data = require('./data-container');
var HomeView = require('data-view-home');
var UserView = require('data-view-user');
var citizen = require('citizen');
var render = require('render');
var title = require('title');
var page = require('page');
var o = require('dom');

page("/data/:page?", valid, external, citizen.required, function(ctx, next) {
  if (!ctx.valid) {
    return next();
  }
  var page = ctx.params.page || "home";
  var container = o(render.dom(data));
  var content = o('.data-content', container);

  var vHome = new HomeView();
  var vUser = new UserView();

  // prepare wrapper and container
  o('#content').empty().append(container);

  // set active section on sidebar
  if (o('.active', container)) {
    o('.active', container).removeClass('active');
  }

  o('[href="/data/' + page + '"]', container).addClass('active');

  // Set page's title
  title(o('[href="/data/' + page + '"]').html());

  // render all data pages
  vHome.appendTo(content);
  vUser.appendTo(content);

  // Display current data page
  o("#" + page + "-wrapper", container).removeClass('hide');
});

/**
 * Check if page is valid
 */

function valid(ctx, next) {
  var page = ctx.params.page || "home";
  var list = ['home', 'user'];
  return ctx.valid = ~list.indexOf(page), next();
}

/**
 * Check if exists external settings
 */

function external(ctx, next) {
  return next();
}
