const logger        = require('../logger');
const PartyTypes    = require('../config/PartyTypes')
const Party         = require('../models/Party')
const uuidV4        = require('uuid/v4')
const parties       = []; // All parties currently active


// no arguments
module.exports.CreateParty = (data) => {
    let p = new Party(uuidV4());
    p.AddMember(data.client)

    parties.push(p);
    data.client.write('partycreated|'+p.party_id)

    logger.info('Created party', {party_id: p.party_id, leader: data.client.id})
}

// [0] party id to join
module.exports.JoinParty = (data) => {
    // Firstly check if player is already in a party.
    let party = GetClientsParty(data.client)

    if(party) {
        // Player is already in party...

        // DESIGN: Kick from current party and join new OR simply deny new join
    } else {
        party.AddMember(data.client)
        logger.info("Client joined a party", {party_id: party.party_id, client: data.client.id})

        socket.write('party.joined')
        // TODO: Broadcast party update to all party members
    }
}

// no arguments (we find party by session id)
module.exports.LeaveParty = (data) => {
    let party = GetClientsParty(data.client)

    if(party) {
        party.RemoveMember(data.client);
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
                    socket.write('party.kick.success')
                    logger.info("A player was kicked from party", { party: party, kicked: member.id, leader: data.client.id})
                    // TODO: Update party members with new party setup
                } else {
                    logger.error('Unexpected error when a client tried to kick someone from party', {party: party, member: member, client: data.client})
                    socket.write('party.kick.failed|unexpected_error')
                }
            } else {
                logger.info('Kick failed because member was not in party', { party: party, leader: data.client.id, attempted_kick: data.args[0] })
                socket.write('party.kick.failed|member_not_found')
            }
            
        }
    } else {
        // We expected a session id to get kicked but we got none
        logger.info('Kick failed because no session id was provided', { party: party, leader: data.client.id })
        socket.write('party.kick.failed|no_session_id_provided')
    }
}

module.exports.GetPartyById = (partyId, party) => {
    let p = this.parties.find(o => o.party_id == partyId);
    party(p);
}

function GetClientsParty(socket) {
    let p = parties.find(p => p.HasMember(socket));
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

    if(parties[i].party_members.length > 0) {
        // We need to kick everyone from this party first
    }

    parties.splice(i, 1);
    if(done)
        done();
}

