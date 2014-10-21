var ripple = require('ripple');
var template = require('./participant');
var render = require('render');

//var src = participant.profilePictureUrl ? participant.profilePictureUrl : participant.gravatar
var Participant = ripple(render(template));
module.exports = Participant;