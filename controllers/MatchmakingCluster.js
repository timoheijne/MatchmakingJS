const MatchTypes    = require('./../config/MatchTypes')
const logger        = require('./../logger')

const clients = [];

let matchmakingStep;

/* Expected events:
 * matchmaking.start: Expect: clients input
 */

// FIXME: Convert to event based event system
process.on('message', message => {
    const event = message.event;

    if(event ==  "matchmaking.start") {
        message.clientData.timestamp_start = new Date().getTime();
        clients.push(message.clientData);
        initMatchmaking();
    }

    if(event == "player.remove") {
        let clientData = clients.find(c => c.clients.indexOf(message.client) != -1)

        console.log(clients.indexOf(clientData), clients)

        clients.splice(clients.indexOf(clientData), 1);

        if(clients.length == 0) {
            stopMatchmaking();
        }
    }
})

function FindMatch() {
    if(clients.length == 0) return;

    let cCopy = clients.slice(0); // Get a copy incase the array gets edited mid search
    let first = cCopy.shift();
    let mType = MatchTypes[first.match_type]

    if (cCopy.length == 0) return; // We can't make a match if there are no others...

    if(!mType) {
        return logger.fatal('Matchmaker failed. Match Type was not found mid search for match', {match_type: mType})
    }

    let lobby = {
        match_type: mType,
        teams: {}
    }

    let matches = [first]; // The first is always a match :D
    cCopy.forEach(client => {
        // Verify if client can join (max elo difference, party and other match type options)
        // Calculate Match Rate

        client.score = CalculateMatchScore(first, client);
        if(client.score == -1) continue; // In the process of calculating we've encountered something which makes this client unfit for this match.

        matches.push(client);
    });

    if(!HasEnoughPlayers(lobby, matches)) return;

    SortMatches(matches);
    // TODO: Implement Score maximum (a high score = bad)

    // Dividing teams is done on the game server's side...

    // Verify if all clients are still in matchmaking.. If not this is an invalid match...

    // Send to master process that match has been made

    // Remove client from clients list
}

function SortMatches(matches) {
    // Lowest score = best score
    matches.sort((a,b) => {
        return a.score - b.score;
    })
}

function CountPlayers(matches) {
    let num = matches.reduce((acc, cur) => {
        acc += cur.clients.length
    })

    return num;
} 

function HasEnoughPlayers(lobby, matches) {
    let requiredPlayers;
    lobby.match_type.TeamSizes.forEach(element => {
        requiredPlayers += element;
    });

    return (CountPlayers(matches) >= requiredPlayers)
}

function CalculateMatchScore(first, second) { // Lower score = Better
    let score = 0;
    score + Math.max(first.elo.average, second.elo.average) - Math.min(first.elo.average, second.elo.average);
    score += second.clients.length * 150;

    return score;
}

function stopMatchmaking() {
    clearInterval(matchmakingStep);
    matchmakingStep = null;
}

function initMatchmaking() {
    if(matchmakingStep) return; // Its already running

    matchmakingStep = setInterval(() => {
        // This is a matchmaking step.
        FindMatch();
    }, 500); // We don't need a while true loop here, Search for a match every .5 of a second is more than enough
    // Also we can reduce this number and make players happy because "We've sped up the matchmaking process" by doing absolutely nothing to the algorithm *cough*
}