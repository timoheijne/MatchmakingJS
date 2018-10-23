require('dotenv').config();

const logger            = require('./logger');
const Event             = require('./controllers/EventEmitter');
const SocketService     = require('./controllers/SocketService')
const cluster           = require('cluster');
require('./controllers/SocketService')

logger.info("Initializing Matchmaking Service")

const matchSocket = new SocketService(process.env.SOCKET_PORT || 1000)

matchSocket.on('client.connect', (data) => {
    console.log('client connected');
})

matchSocket.on('client.message.ping', (data) => {
    console.log('ping received')
})

matchSocket.on('client.end', (data) => {
    console.log('client disconnected')
})

matchSocket.openConnection();

/*
 * Steps:
 * - Open MongoDB connection (optional?)
 * - Open Matchmaking Socket for players to actually join
 * - Open Spawner Socket (the server spawner will join here)
 * 
 *
 * What data we want to store in matchmaking:
 * - Matches that have been made and their status (for logging purposed mainly)
 * 
 * Other stuff we want to store not related to the matchmaking service
 * - Player profiles
 * - Server nodes & their available servers
 * - Match Results (This can be part of the matchmaking service but its really game specific outcome of what needs to be stored)
 */

