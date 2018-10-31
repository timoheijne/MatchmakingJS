const logger        = require('../logger');
const PartyTypes    = require('../config/PartyTypes')
const Party         = require('../models/Party')
const uuidV4        = require('uuid/v4')
const parties       = []; // All parties currently active

// [0] = party type (or default = "Default")
module.exports.CreateParty = (data) => {
    const party_type = data.args[0] || "Default";

    if(!PartyTypes[party_type]) {
        logger.fatal('Provided party type not found... Matchmaking will now use HARDCODED defaults if available or limit functionality', { party_type: party_type})
        return data.client.write('party.create.failed|party_type_not_found')
    }
    
    let p = new Party(uuidV4(), party_type);
    p.AddMember(data.client)

    parties.push(p);

    data.client.matchmakingData.partyId = p.party_id;
    data.client.write('party.create.success|'+p.party_id)

    logger.info('Created party', {party_id: p.party_id, leader: data.client.id, party_type: p.party_type})
}

// [0] party id to join
module.exports.JoinParty = (data) => {
    // Firstly check if player is already in a party.
    const party = GetClientsParty(data.client)
    const pType = PartyTypes[party.party_type];

    // Can't hurt to check right?
    if(!pType) {
        logger.fatal('Client tried to join a party but party type was no longer found?!? HOW?!?! WHY IS IT CREATED', {party: party, client: data.client.id});
        return data.client.write('party.join.failed|party_type_not_found');
    }

    if(party) {
        // Player is already in party...
        data.client.write('party.join.failed|already_in_party')
        logger.info('Player tried to join new party while already in party', {client: data.client.id, attempted_join: party, existing_party: party})
    } else {
        if (party.party_members.length >= pType.max_players) {
            return data.client.write('party.join.failed|party_full')
        }

        GetPartyById(data.args[0], 
            () => {
                data.client.write('party.join.failed|party_not_found');
                logger.info('Client tried to join non existing party', {client: data.client.id, party_id: data.args[0]})
            },
            p => {
                p.AddMember(data.client)
                logger.info("Client joined a party", { party_id: p.party_id, client: data.client.id })

                data.client.matchmakingData.partyId = p.party_id;
                data.client.write('party.join.success')
            // TODO: Broadcast party update to all party members
            }
        )        
    }
}

// no arguments (we find party by session id)
module.exports.LeaveParty = (data) => {
    let party = GetClientsParty(data.client)

    if(party) {
        party.RemoveMember(data.client);

        delete data.client.matchmakingData.partyId;

        data.client.write('party.left')
        logger.info('Client left a Left Party', {party_id: party.party_id, client: data.client.id})

        if(party.party_members.length == 0) {
            return DisbandParty(party.party_id)
        }

        // TODO: Broadcast party update to all party members
    }
}

// [0] = session id to kick from party (we find party by session id)
module.exports.Kick = (data) => {
    if(data.args[0]) {
        const party = GetClientsParty(data.client);
        if (party && party.GetLeader().id == data.client.id && data.args[0] != data.client.id) {
            const member = party.party_members.find(m => m.id == data.args[0]);

            if(member) {
                // We found a member
                if (party.RemoveMember(member)) {
                    // member removed from party

                    // TODO: Check if the socket data is actually updated when doing it like this
                    delete member.matchmakingData.partyId;

                    data.client.write('party.kick.success')
                    logger.info("A player was kicked from party", { party: party, kicked: member.id, leader: data.client.id})
                    // TODO: Update party members with new party setup
                } else {
                    logger.error('Unexpected error when a client tried to kick someone from party', {party: party, member: member, client: data.client})
                    data.client.write('party.kick.failed|unexpected_error')
                }
            } else {
                logger.info('Kick failed because member was not in party', { party: party, leader: data.client.id, attempted_kick: data.args[0] })
                data.client.write('party.kick.failed|member_not_found')
            }
            
        }
    } else {
        // We expected a session id to get kicked but we got none
        logger.info('Kick failed because no session id was provided', { party: party, leader: data.client.id })
        data.client.write('party.kick.failed|no_session_id_provided')
    }
}

module.exports.GetPartyById = (partyId, error, party) => {
    let p = parties.find(o => o.party_id == partyId);
    if(p) {
        party(p)
    } else {
        error()
    }
}

function GetClientsParty(socket) {
    let p = parties.find(p => p.HasMember(socket.id));
    return p;
}

function DisbandParty(partyId, error, done) {
    let i = parties.findIndex(p => p.party_id == partyId);

    if(i == -1) {
        if(error)
            return error({message: 'Party was not found', party_id: partyId});
        else 
            return;
    }

    logger.info('Disbanding party...', { party: parties[i] })

    if(parties[i].party_members.length > 0) {
        logger.info('Kicking clients from disbaning party', { party: parties[i]  })
        // TODO: Kick everyone from party
    }

    const p = parties.splice(i, 1);
    logger.info('Party disbanded', { party: p })

    if(done)
        done();
}

