const logger = require('../logger');

const SocketService     = require('../services/SocketService');
const ServerSpawner     = require('./../controllers/ServerSpawner');

const socket = new SocketService(process.env.SPAWNER_PORT || 1200)

logger.info('Setting up Spawner routes')

// TODO: Convert to client.

socket.openConnection();