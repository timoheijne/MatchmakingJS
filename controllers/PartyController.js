const logger        = require('../logger');
const PartyTypes    = require('../config/PartyTypes')
const Party         = require('../models/Party')
const uuidV4        = require('uuid/v4')
const parties = []; // All parties currently active


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
    } else {
        party.AddMember(data.client)

        // TODO: Broadcast party update to all party members
    }
}

// no arguments (we find party by session id)
module.exports.LeaveParty = (data) => {
    let party = GetClientsParty(data.client)

    if(party) {
        party.RemoveMember(data.client);
        data.client.write('leftparty')
        logger.info('Left Party', {party_id: party.party_id, client: data.client.id})

        if(party.party_members.length == 0) {
            DisbandParty(party.party_id)
        } else {
            // Loop throug the party members and announce the new party setup
        }

        // TODO: Broadcast party update to all party members
    }
}

// [0] = session id to kick from party (we find party by session id)
module.exports.Kick = (data) => {
    // 1. Get party
    // 2. Check if kicker is party leader
}

module.exports.GetPartyById = (partyId, party) => {
    let p = this.parties.find(o => o.party_id == partyId);
    party(p);
}

function GetClientsParty(socket) {
    let p = parties.find(p => p.HasMember(socket));
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

