const logger = require('../logger');
const MatchTypes = require('../config/MatchTypes')

const clients = []; // All clients currently awaiting a match will be stored here
// We should try to work FIFO (First in, First Out) here

// args: [0] = Match Type, [1] = party id (optional)
module.exports.SearchMatch = (data) => {
    /*
     * Steps:
     * 0. Check if solo or party
     * 1. Check if match type is valid
     * 2. Search for a lobby player(s) can join
     * 3. If no match found, Create lobby
     */

    if (MatchTypes.indexOf(data.args[0]) != -1) {
        console.log('Heyyyy')
    }
}

