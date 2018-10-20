require('dotenv').config();
const logger = require('./logger');
const Event = require('./controllers/EventEmitter');
const SocketService = require('./controllers/SocketService')

require('./controllers/SocketService')

logger.info("Initializing Matchmaking Service")

const matchSocket = new SocketService(process.env.SOCKET_PORT || 1000)
matchSocket.openConnection();