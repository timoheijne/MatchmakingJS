const logger            = require('../logger');
const MatchTypes        = require('../config/MatchTypes')
const uuidV4            = require('uuid/V4')
const PartyController   = require('./PartyController')
const cluster           = require('cluster');

const clients = []; // All clients currently awaiting a match will be stored here

let clusterRespawns     = 0;
let worker;
// We should try to work FIFO (First in, First Out) here

module.exports.InitializeMatchmaking = () => {
    if(worker) {
        // A worker already exists.. Kill this one first
        logger.info(`Killed matchmaking worker PID:${worker.process.pid}`)
        worker.killed = true;
        worker.kill();
    }

    logger.info(`Initializing Matchmaking Cluster`)
    worker = cluster.fork();
}

// args: [0] = Match Type | If player is in party its automatically detected
module.exports.JoinMatchmaking = (data) => {
    const mType = data.client.matchmakingData.matchType = data.args[0] || "Default";

    if(!MatchTypes[mType]) {
        logger.fatal('Provided Match Type does NOT exist', {match_type: mType, client: data.client.id});
        return data.client.write('matchmaking.failed|incorrect_match_type')
    }

    if(data.client.matchmakingData.partyId) {
        // Party ID has been send check if party exists and if client is leader
        PartyController.GetPartyById(data.client.matchmakingData.partyId, () => {
            // No party was found, but partyId was set.
            logger.info('Player has party ID in system, but party does not exist', { session_id: data.client.id, party_id: data.client.matchmakingData.partyId})
            return data.client.write('matchmaking.failed|party_id_incorrect')
        }, party => {
            // Party was found
            if (party.GetLeader().id == data.client.id) {
                // Player is leader.. We can start matchmaking with party

                logger.info('Matchmaking for party started', { party_id: party.party_id, match_type: mType})
                clients.push(party.party_members);

                const clientData = {
                    match_type: mType,
                    clients: party.party_members.map(m => { return m.id }),
                    elo: {
                        average: 0,
                        max: 0,
                        min: 0
                    }
                    // TODO: Calculate elo's
                }

                // Unfortunately we cannot passaslong sockets to the worker, so we have to send the ids and convert them back to sockets on callback
                worker.send({ event: 'matchmaking.start', clientData: clientData});
                
                party.party_members.forEach(member => {
                    member.write('matchmaking.started');
                })
            } else {
                logger.info('Client tried to start matchmaking with party but is not party leader', { client: data.client.id, party_id: party.party_id})
                return data.client.write('matchmaking.failed|not_party_leader');
            }
        })
    } else {
        // Player is not in party
        clients.push([data.client]);
        logger.info('Solo queue matchmaking started', { match_type: mType, client: data.client.id })

        const clientData = {
            match_type: mType,
            clients: data.client.id,
            elo: {
                average: 0,
                max: 0,
                min: 0
            }
            // TODO: Calculate elo's
        }

        // Unfortunately we cannot passaslong sockets to the worker, so we have to send the ids and convert them back to sockets on callback
        worker.send({ event: 'matchmaking.start', clientData: clientData })
        data.client.write('matchmaking.started');
    }
}

// [0] = Leave with party (can only if party leader... Otherwise player will also leave party)
module.exports.LeaveMatchmaking = (data) => {
    let index = clients.findIndex(c => c.id == data.client.id);
    clients.splice(index, 1);

    worker.send({event: "player.remove", client: data.client.id})

    // TODO: send to all players in party that matchmaking has stopped if with party and party leader
    data.client.write('matchmaking.stopped');
}

cluster.on('online', worker => {
    logger.info(`Cluster worker ${worker.process.pid} is online`)

    // Send all current clients 

    // Setup message listener
    worker.on('message', message => {
        console.log(message)
    })
})

cluster.on('exit', worker => {
    if(clusterRespawns >= 10) {
        // TODO: Send an emergency message to some API that can notify us that the matchmaker is no longer working
        throw Error("Unable to start cluster... Cannot initialize matchmaker process")
    }

    if(!worker.killed) {
        logger.fatal(`Our matchmaking cluster ${worker.process.pid} died, Initializing new cluster`)
        this.InitializeMatchmaking();
        clusterRespawns += 1;
    } else {
        logger.info(`Cluster ${worker.process.pid} was manually stopped`)
    }
        
})