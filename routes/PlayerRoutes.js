const logger = require('../logger');

const SocketService     = require('../services/SocketService');
const Matchmaker        = require('./../controllers/MatchController');
const PlayerAuth        = require('../controllers/Authentication');
const PartyController   = require('../controllers/PartyController')

const socket = new SocketService(process.env.MATCH_PORT || 1000)

logger.info('Setting up Player routes')

// All clients are referenced by their session id NOT THEIR UID incase we don't require authentication

// TODO: Middleware implementation for is user authenticated etc?

// All sockets should have an identification ID after this point.
socket.on('client.message.authenticate', PlayerAuth.PlayerAuthentication);

// All sockets should be authenticated after this point
socket.on('client.disconnect', PlayerAuth.IsAuthenticated, PartyController.LeaveParty)

socket.on('client.message.joinMatchmaking', PlayerAuth.IsAuthenticated, Matchmaker.SearchMatch)

socket.on('client.message.createParty', PlayerAuth.IsAuthenticated, PartyController.CreateParty)
socket.on('client.message.joinParty', PlayerAuth.IsAuthenticated, PartyController.JoinParty)
socket.on('client.message.leaveParty', PlayerAuth.IsAuthenticated, PartyController.LeaveParty)
socket.on('client.message.kickPlayerParty', PlayerAuth.IsAuthenticated, PartyController.Kick)

// Keep unauthentication as last, this will cause the client to be unable to do certain things if unauthenticated
socket.on('client.disconnect', PlayerAuth.IsAuthenticated, PlayerAuth.PlayerUnauthenticate);


socket.openConnection();