const logger = require('../logger');

const SocketService     = require('../services/SocketService');
const Matchmaker        = require('./../controllers/Matchmaker');
const PlayerAuth        = require('./../controllers/PlayerAuth');

const socket = new SocketService(process.env.MATCH_PORT || 1000)

logger.info('Setting up Player routes')


socket.openConnection();