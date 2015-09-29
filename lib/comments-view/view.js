/**
 * Module dependencies.
 */

var citizen = require('citizen');
var config = require('config');
var CommentCard = require('comment-card');
var CommentsFilter = require('comments-filter');
var FormView = require('form-view');
var template = require('./template');
var request = require('request');
var loading = require('loading-lock');
var o = require('dom');
var t = require('t');
var log = require('debug')('democracyos:comments-view');
var scroll = require('scroll-to');
var isInViewport = require('is-in-viewport');

/**
 * Expose CommentsView
 */

module.exports = CommentsView;

/**
 * Creates a CommentsView
 *
 * @param {String} reference
 */

function CommentsView(law, reference) {
  if (!(this instanceof CommentsView)) {
    return new CommentsView(law, reference);
  }

  this.law = law;

  FormView.call(this, template, {
    law: law,
    reference: reference
  });

  this.page = 0;
  this.filter = new CommentsFilter();
  this.sort = this.filter.getSort();
  this.filter.appendTo(this.find('.all-comments h4')[0]);

  this.comments = [];
  this.mycomments = [];
  this.textarea = this.find('textarea');
}

/**
 * Inherit from FormView
 */

FormView(CommentsView);

/**
 * Initialize comments
 *
 * @api public
 */

CommentsView.prototype.initialize = function() {
  this.initializeComments();
  this.initializeMyComments();
};

/**
 * Load initial set of comments
 *
 * @api public
 */

CommentsView.prototype.initializeComments = function() {
  this.page = 0;
  this.comments = [];
  this.find('btn.load-comments').addClass('hide');
  var view = this;
  request
  .get(this.url() + '/comments')
  .query({ count: true })
  .query({ sort: this.sort })
  .query({ exclude_user: citizen.id || null })
  .end(function(err, res) {
    if (err) {
      log('Fetch error: %s', err);
      return;
    }
    if (!res.ok) {
      log('Fetch error: %s', res.error);
      return;
    }
    if (res.body && res.body.error) {
      log('Fetch response error: %s', res.body.error);
      return;
    }
    view.count = res.body;
    view.fetch();
  });
};

/**
 * Load user's comments
 *
 * @api public
 */

CommentsView.prototype.initializeMyComments = function() {
  if (citizen.id) {
    var view = this;
    request
    .get(this.url() + '/my-comments')
    .end(function(err, res) {
      if (err) {
        log('Fetch error: %s', err);
        return;
      };
      if (!res.ok) {
        log('Fetch error: %s', res.error);
        return;
      };
      if (res.body && res.body.error) {
        log('Fetch response error: %s', res.body.error);
        return;
      };
      view.emit('fetch my comments', res.body);
    });
  }
};

/**
 * Fetch comments
 *
 * @api public
 */

CommentsView.prototype.fetch = function() {
  var view = this;
  this.loadingComments();
  request
    .get(view.url() + '/comments')
    .query({ page: view.page })
    .query({ sort: view.sort })
    .query({ limit: config.commentsPerPage })
    .query({ exclude_user: citizen.id || null })
    .end(function(err, res) {
      view.unloadingComments();
      if (err) {
        log('Fetch error: %s', err);
        return;
      };
      if (!res.ok) {
        log('Fetch error: %s', res.error);
        return;
      };
      if (res.body && res.body.error) {
        log('Fetch response error: %s', res.body.error);
        return;
      };
      view.emit('fetch', res.body);
    });
};

CommentsView.prototype.switchOn = function() {
  this.bind('click', '.new-comment', 'showNewComment');
  this.bind('click', '.cancel-new-comment', 'hideNewComment');
  this.bind('click', '.load-comments', 'fetch');
  this.on('success', this.bound('onsuccess'));
  this.on('fetch', this.bound('load'));
  this.on('fetch my comments', this.bound('loadMyComments'));
  this.on('post', this.bound('addmycomment'));
  this.on('no more comments', this.nomorecomments.bind(this));
  this.on('more comments', this.morecomments.bind(this));
  this.filter.on('change', this.bound('onfilterchange'));
};

CommentsView.prototype.switchOff = function() {
  this.filter.off('change', this.bound('onfilterchange'));
};

/**
 * Load comments in view's `el`
 *
 * @param {Array} comments
 * @api public
 */

CommentsView.prototype.loadMyComments = function(comments) {
  if (comments.length) {
    this.hideNewComment();
    comments.forEach(this.bound('addmycomment'));
  } else {
    this.find('.cancel-new-comment').addClass('hide');
  }
};

/**
 * Load comments in view's `el`
 *
 * @param {Array} comments
 * @api public
 */

CommentsView.prototype.load = function(comments) {
  if( !comments.length ) return this.refreshState();

  log('load %o', comments);

  var els = this.find('.all-comments li.comment-item');

  this.add(comments);

  if (!this.page) {
    els.remove();
  }

  if (this.comments.length == this.count) {
    this.emit('no more comments');
  } else {
    this.emit('more comments');
  }

  this.refreshState();

  this.page++;
  this.emit('load');
};

CommentsView.prototype.refreshState = function() {
  if (!this.comments.length || this.comments.length === 1) {
    this.filter.el.addClass('hide');
  } else {
    this.filter.el.removeClass('hide');
  }

  if (!this.comments.length) {
    var span = o('<span></span>');
    var text = citizen.id ? t('comments.no-citizen-comments') : t('comments.no-comments');
    span.html(text).addClass('no-comments');
    var existing = this.find('.no-comments');
    if (existing.length) existing.remove();
    this.find('.comments-list').append(span[0]);
    return this.emit('no more comments');
  }
};

CommentsView.prototype.add = function(comment) {
  var self = this;

  if( Array.isArray(comment) ) {
    comment.forEach(function(c){
      this.add(c);
    }, this);
    return;
  }

  var card = new CommentCard(comment);
  this.comments.push(comment);
  var container = this.find('.comments-list')[0];
  card.appendTo(container);
  card.on('delete', function(){
    self.comments.splice(self.comments.indexOf(comment), 1);
    self.bound('refreshState')();
  });
};

CommentsView.prototype.addmycomment = function(comment) {
  var card = new CommentCard(comment);
  var container = this.find('.my-comments-list')[0];
  this.mycomments.push(comment);
  card.appendTo(container);
  card.on('delete', this.bound('removemycomment'));
};

CommentsView.prototype.removemycomment = function(comment) {
  var i = this.mycomments.indexOf(comment);
  this.mycomments.splice(i, 1);
  if (!this.mycomments.length) {
    this.find('.comment-form').removeClass('hide');
    this.find('.new-comment').addClass('hide');
    this.find('.cancel-new-comment').addClass('hide');
  }
};

CommentsView.prototype.onsuccess = function(res) {
  var comment = res.body;
  this.addmycomment(comment);
  this.hideNewComment();
};

CommentsView.prototype.showNewComment = function(ev) {
  ev.preventDefault();

  var form = this.find('.comment-form');
  form.toggleClass('hide');
  this.find('.new-comment').addClass('hide');

  if (!form.hasClass('hide') && !isInViewport(form[0])) {
    var textarea = this.find('p textarea', form)[0];
    scroll(form[0]);
    textarea.focus();
  }

};

CommentsView.prototype.hideNewComment = function() {
  this.textarea.val('');

  this.find('.comment-form').toggleClass('hide');
  this.find('.new-comment').removeClass('hide');
  this.find('span.error').remove();
  this.find('.error').removeClass('error');
};

/**
 * Display a spinner when loading comments
 *
 * @api public
 */

CommentsView.prototype.loadingComments = function() {
  this.list = this.find('.inner-container')[0];
  this.loadingSpinner = loading(this.list, { size: 100 }).lock();
};

/**
 * Remove spinner when comments are loaded
 */

CommentsView.prototype.unloadingComments = function() {
  this.loadingSpinner.unlock();
};

/**
 * When there are more comments to show
 *
 * @api public
 */

CommentsView.prototype.morecomments = function() {
  this.find('.load-comments').removeClass('hide');
};

/**
 * When there are no more comments to show
 *
 * @api public
 */

CommentsView.prototype.nomorecomments = function() {
  this.find('.load-comments').addClass('hide');
};

/**
 * When comments filter change,
 * re-fetch comments
 *
 * @api public
 */

CommentsView.prototype.onfilterchange = function(sort) {
  this.sort = this.filter.getSort();
  this.initializeComments();
};

/**
 * Get api route
 */

CommentsView.prototype.url = function() {
  return '/api/law/:id'.replace(':id', this.law.id);
};
