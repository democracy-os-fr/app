/**
 * Module dependencies.
 */

var page = require('page');
var o = require('dom');
var t = require('t');
var render = require('render');
var noLaws = require('./no-laws');
var classes = require('classes');
var LawsBlocks = require('./view');
var Laws = require('laws-filter');
var bus = require('bus');
var log = require('debug')('democracyos:laws-blocks');

// Routing.
page('/laws-blocks', function(ctx, next) {
  o(document.body).addClass('browser-page');

  var laws = Laws.items();
  console.log(laws);
 
  function onpagechange() {
    o(document.body).removeClass('browser-page');
  }

  if (!laws) {
    console.log('nothing');
    var el = render.dom(noLaws);
    o('#browser .app-content').empty().append(el);
    bus.once('page:change', onpagechange);
    return bus.emit('page:render');
  }

  var laws_blocks = new LawsBlocks(laws);
  classes(document.body).add('laws');
  laws_blocks.replace('#content'); 

  //log('render law %s', law.id);
  //ctx.path = '/law/' + law.id;
  next();
});
