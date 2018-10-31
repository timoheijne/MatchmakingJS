const logger            = require('../logger');
const MatchTypes        = require('../config/MatchTypes')
const uuidV4            = require('uuid/V4')
const PartyController   = require('./PartyController')
const cluster           = require('cluster');

let worker;

const clients = {}; // All clients currently awaiting a match will be stored here

const lobbies = {};
// We should try to work FIFO (First in, First Out) here

module.exports.InitializeMatchmaking = () => {
    if(worker) {
        // A worker already exists.. Kill this one first
        logger.info(`Killed matchmaking worker PID:${worker.pid}`)
        worker.kill();
    }

    logger.info(`Initializing Matchmaking Cluster`)
    worker = cluster.fork();
}


















/////////////////////////////////////////////////////////////////////////
// REFACTORING IN PROGRESS
/////////////////////////////////////////////////////////////////////////

// args: [0] = Match Type, [1] = party id (optional)
module.exports.SearchMatch = (data) => {
    /*
     * Steps:
     * 0. Check if solo or party
     * 1. Check if match type is valid
     * 2. Search for a lobby player(s) can join
     * 3. If no match found, Create lobby
     */

    const mType = data.args[0] || "Default";
    const partyId = data.args[1] || null;

    // Check if player is already in a lobby
    const pLobby = GetPlayerLobby(data.client.id);

    PartyController.GetPartyById(partyId, () => {
        // No party found
        logger.error('Client provided party id, No party was found', {party_id: partyId, session_id: data.client.id})
        return data.client.write('matchmaking.join.failed|incorrect_party_id')
    }, party => {
        // Party found
    })    

    console.log(mType, partyId);

    if (MatchTypes[mType]) {
        if(!lobbies[mType]) {
            // No match exists with this match type
            lobbies[mType] = {};
            const lobby = {
                id: uuidV4(),
                match_type: mType,
                players: [data.client],
            }

            lobbies[mType][Object.keys(lobbies[mType]).length] = lobby;
            logger.info("Lobby Created", {lobby_id: lobby.id, session_id: data.client.id})
            data.client.write('matchmaking.join.success|'+lobby.id);
        } else {
            PollLobbies(data);
        }
    } else {
        logger.fatal("Player tried to join matchmaking with an unknown match type", {match_type: mType})
        data.client.write("matchmaking.join.failed|unknown_match_type")
    }
}

module.exports.LeaveLobby = (data) => {

}

// args: [0] = Match Type, [1] = Party ID
module.exports.PollLobbies = (data) => {

}

function GetPlayerLobby(session_id) {
    lobbies.forEach(matchLobbies => {
        matchLobbies.forEach(lobby => {
            const p = lobby.players.find(p => p.id == session_id)
            return p;
        })
    });
}