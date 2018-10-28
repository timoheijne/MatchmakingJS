const logger = require('../logger');

const SocketService     = require('../services/SocketService');
const Matchmaker        = require('./../controllers/Matchmaker');
const PlayerAuth        = require('../controllers/Authentication');

const socket = new SocketService(process.env.MATCH_PORT || 1000)

logger.info('Setting up Player routes')

// All clients are referenced by their session id NOT THEIR UID incase we don't require authentication

// TODO: Middleware implementation for is user authenticated etc?

// All sockets should have an identification ID after this point.
socket.on('client.message.authenticate', PlayerAuth.PlayerAuthentication);

// All sockets should be authenticated after this point
socket.on('client.disconnect', PlayerAuth.IsAuthenticated ,PlayerAuth.PlayerUnauthenticate);
socket.on('client.message.joinMatchmaking', Matchmaker.SearchMatch)

socket.on('client.message.createParty', Matchmaker.SearchMatch)
socket.on('client.message.joinParty', Matchmaker.SearchMatch)
socket.on('client.message.leaveParty', Matchmaker.SearchMatch)

socket.openConnection();