const logger          = require('./../logger');
const AuthModel = require('./../models/Authenticated');
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
    if(authenticated.find(a => a = data.client.id)) {
        // Player already authenticated
        return logger.debug("Double authentication detected", {socket_id: data.client.id});
    }

    data.client.uid = 0;
    const auth = new AuthModel(data.client.id, data.client.remoteAddress)

    authenticated.push(auth); // Clients session id

    // TODO: Store session id & uid in database for logging
    // TODO: IP Bind authentication to prevent spoofing and other errors
    
    logger.info('Client authenticated', { uid: data.client.uid, session_id: data.client.id, remoteAddress: data.client.remoteAddress })

    data.client.write('authenticated');   
}

module.exports.PlayerUnauthenticate = (data, next) => {
    logger.info('Client unauthenticated', { uid: data.client.uid, session_id: data.client.id})
    let i = authenticated.findIndex(a => a.session_id == data.client.id && a.remoteAddress == data.client.remoteAddress);
    authenticated.splice(i, 1);
}

module.exports.IsAuthenticated = (data, next) => {
    let auth = authenticated.find(a => a.remoteAddress == data.client.remoteAddress && a.session_id == data.client.id);

    if(auth) {
        next();
    } else {
        data.client.write('unauthenticated')
    }
}

module.exports.SpawnerAuthentication