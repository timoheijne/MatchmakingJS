const logger = require('./../logger');

const authenticated = [];

/*
 * Something to ponder about: Should the server before authentication send required game version?
 */

// Expected Input: [0] = Player ID [1] = Player Secret
module.exports.PlayerAuthentication = (data) => {
    /*
     *  1. Verify data that has been sent through (expected data: player_id & player_secret) OR some other form of auth string like JWT
     *  2. Make connection to auth server to verify if data is correct
     *  3. Ack authentication
     */
    data.client.uid = 0;
    authenticated.push({session_id: data.client.id, uid: 0}); // Clients session id

    // TODO: Store session id & uid in database for logging
    
    logger.info('Client authenticated', { uid: data.client.uid, session_id: data.client.id })

    data.client.write('authenticated');   
}

module.exports.PlayerUnauthenticate = (data) => {
    console.log(data.client.test);
    logger.info('Client unauthenticated', { uid: data.client.uid, session_id: data.client.id})
    authenticated.splice(authenticated.indexOf(data.client.id), 1);
    console.log(authenticated);
}

module.exports.IsAuthenticated = (data, next) => {
    next();
}

module.exports.SpawnerAuthentication