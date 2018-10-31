require('dotenv').config(); // This thing doesn't recognize booleans... that was quite unexpected..

const logger            = require('./logger');
const Event             = require('./controllers/EventEmitter');
const cluster           = require('cluster');
const Matchmaker        = require('./controllers/MatchController')

let clusterRespawns     = 0;

if(cluster.isMaster) {
    logger.info(`Initializing Matchmaking Service PID:${process.pid}`)

    require('./routes/PlayerRoutes')
    Matchmaker.InitializeMatchmaking();

    cluster.on('online', worker => {
        logger.info(`Cluster worker ${worker.process.pid} is online`)
        clusterRespawns = 0;
    })

    cluster.on('exit', worker => {
        if(clusterRespawns >= 10) {
            // TODO: Send an emergency message to some API that can notify us that the matchmaker is no longer working
            throw Error("Unable to start cluster... Cannot initialize matchmaker process")
        }

        if(!worker.suicide) {
            logger.fatal(`Our matchmaking cluster ${worker.process.pid} died, Initializing new cluster`)
            Matchmaker.InitializeMatchmaking();
            clusterRespawns += 1;
        } else {
            logger.info(`Cluster ${worker.process.pid} was manually stopped`)
        }
            
    })
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