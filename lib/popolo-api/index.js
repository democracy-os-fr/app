/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var pluck = utils.pluck;
var expose = utils.expose;
var log = require('debug')('democracyos:popolo');
var config = require('lib/config');
var utils = require('lib/utils');

var app = module.exports = express();

app.use(accepts(['application/json', 'text/html']));

app.get('/', function (req, res) {
  res.json({api: 'json'});
});


var topicListKeys = [
  'id topicId title mediaTitle status open closed public draft deleted forum',
  'tag participants voted createdAt updatedAt closingAt',
  'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
].join(' ');

var topicKeys = topicListKeys
              + ' '
              + 'summary clauses source state upvotes downvotes abstentions';

function exposeTopic(topicDoc, user, keys) {
  if (!keys) keys = topicKeys;

  var topic = topicDoc.toJSON();
  topic.voted = topicDoc.votedBy(user);

  return expose(keys)(topic);
}

function findForum(req, res, next) {
  if (!config.multiForum) return next();

  if (!mongoose.Types.ObjectId.isValid(req.query.forum)) {
    return _handleError('Must define a valid \'forum\' param.', req, res);
  }

  api.forum.findById(req.query.forum, function(err, forum){
    if (err) return _handleError(err, req, res);
    if (!forum) return _handleError(new Error('Forum not found.'), req, res);

    req.forum = forum;
    next();
  });
}

function onlyForumAdmins(req, res, next) {
  if (!req.user) _handleError(new Error('Unauthorized.'), req, res);

  if (config.multiForum) {
    if (req.forum.isAdmin(req.user)) return next();
    return _handleError(new Error('Unauthorized.'), req, res);
  }

  if (req.user.staff) return next();
  return _handleError(new Error('Unauthorized.'), req, res);
}

app.get('/motion/all',
findForum,
function(req, res, next) {
  if (req.query.draft) {
    onlyForumAdmins(req, res, next);
  } else {
    next();
  }
},
function (req, res) {
  log('Request /motion/all');

  api.topic.all({
    forum: req.forum
  }, function(err, topics) {
    if (err) return _handleError(err, req, res);

    topics = topics.filter(function(topic) {
      if (topic.public) return true;
      if (req.query.draft && topic.draft) return true;
      return false;
    });

    log('Serving topics %j', pluck(topics, 'id'));

    res.json(topics.map(function(topicDoc){
      return exposeTopic(topicDoc, req.user, topicListKeys);
    }));
  });
});

app.get('/motion/:id', function (req, res) {
  log('Request GET /motion/%s', req.params.id);

  api.topic.get(req.params.id, function (err, topic) {
    if (err) return _handleError(err, req, res);
    if (!topic) return res.send(404);
    res.json(exposeTopic(topic, req.user));
  });
});

function _handleError (err, req, res) {
  log('Error found: %s', err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}
