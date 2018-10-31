require('dotenv').config(); // This thing doesn't recognize booleans... that was quite unexpected..

const logger            = require('./logger');
const Event             = require('./controllers/EventEmitter');
const cluster           = require('cluster');

if(cluster.isMaster) {
    logger.info(`Initializing Matchmaking Service PID:${process.pid}`)

    require('./routes/PlayerRoutes')
    const Matchmaker        = require('./controllers/MatchController')
    Matchmaker.InitializeMatchmaking();
} else {
    require('./controllers/MatchmakingCluster');
}



// TODO: Add some form of authentication?

/*
 * Steps:
 * - Open MongoDB connection (optional?)
 * - Open Matchmaking Socket for players to actually join
 * - Open Spawner Socket (the server spawner will join here)
 * - Open a connection with some form of authentication service either REST Api or socket
 * 
 * What data we want to store in matchmaking:
 * - Matches that have been made and their status (for logging purposed mainly)
 * 
 * Other stuff we want to store not related to the matchmaking service
 * - Player profiles
 * - Server nodes & their available servers
 * - Match Results (This can be part of the matchmaking service but its really game specific outcome of what needs to be stored)
 */