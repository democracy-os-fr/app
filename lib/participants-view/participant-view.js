var reactive = require('reactive');
var template = require('./participant');
var render = require('render');

//var src = participant.profilePictureUrl ? participant.profilePictureUrl : participant.gravatar
var Participant = reactive(render(template), { participant: { fullName: 'Pepe', gravatar: '#'}});
module.exports = Participant;