/**
 * Module dependencies.
 */

var netid = require('lib/netid');

exports.verified_citizen = function (req, res, next) {
  if (!req.user) res.send(500);
  netid.isVerified(req.user, function(err) {
    if (err) return res.send(500);
    next();
  });
};