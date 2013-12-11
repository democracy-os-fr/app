/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var log = require('debug')('democracyos:netid');
var request = require('superagent');
var config = require('lib/config');

function NetId() {
  if (!(this instanceof NetId)) return new NetId();
  this.$_state = 'authenticating';
  this.$_options = config('netid');
  this.$_endpoints = this.$_options['endpoints'];
  this.$_baseUrl = this.$_options['base url'];

  log('options %j', this.$_options);
  log('endpoints %j', this.$_endpoints);
  log('base url %j', this.$_baseUrl);
  this.authenticate();
};

/**
 * Inherits from `EventEmitter`.
 */

NetId.prototype.__proto__ = EventEmitter.prototype;

NetId.prototype.authenticate = function() {
  var endpoint = this.$_endpoints['request token'];
  var req = this.request(endpoint.method, endpoint.path);
  var _this = this;

  req.send({
    "client_id": this.$_options['client id'],
    "client_secret": this.$_options['client secret'],
    "grant_type": "client_credentials"
  });

  log('request for credentials');

  req.$_request.set('Content-Type', 'application/x-www-form-urlencoded');
  req.$_request.end(function(err, res) {
    var u = res.body;

    if (err || !res.ok) {
      // return _handleRequestError.bind(_this)(err || res.error);
      return;
    };
    if (!u || u.error) {
      return;
    };

    for (var prop in u) {
      if (u.hasOwnProperty(prop)) {
        _this[prop] = u[prop]
      }
    }

    _this.$_state = "authenticated";
    _this.emit('ready');
  });
}

NetId.prototype.ready = function(fn) {
  var _this = this;

  function done() {
    if ("authenticated" === _this.state()) {
      return fn();
    } else {
      // here we should handle other states...
    }
  }

  if ("authenticated" === this.state()) {
    setTimeout(done, 0);
  } else {
    this.once("ready", done);
  }

  return this;
};

NetId.prototype.state = function() {
  return this.$_state;
}

NetId.prototype.request = function(method, path) {
  var req = NetIdRequest(this);
  req[method.toLowerCase()](path.toLowerCase());
  return req;
}

NetId.prototype.isVerified = function(user, fn) {
  var endpoint = this.$_endpoints['verified identity'];
  var req = this.request(endpoint.method, endpoint.path);
  req.send({
    email: user.email
  });

  req.end(function(err, res) {
    // PARSE ERRORS!!!!
    fn();
  });
}

function NetIdRequest(manager) {
  if (!(this instanceof NetIdRequest)) return new NetIdRequest(manager);
  this.$_manager = manager;
}

NetIdRequest.prototype.get = function(path) {
  this.$_request = request.get(this.url(path));
}

NetIdRequest.prototype.post = function(path) {
  this.$_request = request.post(this.url(path));
}

NetIdRequest.prototype.send = function(data) {
  this.$_request.send(data);
}

NetIdRequest.prototype.query = function(data) {
  this.$_request.query(data);
}

NetIdRequest.prototype.url = function(path) {
  return this.$_manager.$_baseUrl + path;
}

NetIdRequest.prototype.end = function(fn) {
  var req = this.$_request;
  var manager = this.$_manager;  

  if (manager.access_token) req.set('Authorization', "Bearer " + manager.access_token);;

  req.set('Content-Type', 'application/x-www-form-urlencoded');

  manager.ready(function() {
    req.end(fn);
  });
}

module.exports = NetId();
